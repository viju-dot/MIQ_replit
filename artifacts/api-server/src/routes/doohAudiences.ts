import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db, savedAudiencesTable, type AudienceData } from "@workspace/db";
import {
  ArchiveDoohAudienceParams,
  ArchiveDoohAudienceResponse,
  CreateDoohAudienceBody,
  CreateDoohAudienceResponse,
  ListDoohAudiencesResponse,
  UpdateDoohAudienceBody,
  UpdateDoohAudienceParams,
  UpdateDoohAudienceResponse,
  UseDoohAudienceParams,
  UseDoohAudienceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type GeoDefinition = AudienceData["geoDefinition"];
type GeoType = AudienceData["geoType"];
const V2_NAME_PATTERN = /^[A-Za-z0-9-]{5,50}$/;

function geographyError(
  geoType: GeoType,
  definition: GeoDefinition,
): string | undefined {
  if (geoType === "points" && definition.points.length === 0) {
    return "Points geography requires at least one coordinate";
  }
  if (geoType === "radius") {
    if (definition.points.length !== 1) {
      return "Radius geography requires exactly one centre coordinate";
    }
    if (
      definition.radius === undefined ||
      !Number.isFinite(definition.radius) ||
      definition.radius <= 0
    ) {
      return "Radius geography requires a positive radius";
    }
  }
  if (
    geoType === "polygon" &&
    (!definition.polygon || definition.polygon.length < 3)
  ) {
    return "Polygon geography requires at least three coordinates";
  }
  return undefined;
}

function toAudience(row: typeof savedAudiencesTable.$inferSelect) {
  return {
    id: row.id,
    ...row.data,
    createdDate: row.createdAt,
    updatedDate: row.updatedAt,
  };
}

function validationMessage(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid request";
  const field = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
  return `${field}${issue.message}`;
}

async function hasDuplicateName(name: string, excludedId?: string) {
  const condition = sql`lower(${savedAudiencesTable.data}->>'name') = lower(${name})`;
  const rows = await db
    .select({ id: savedAudiencesTable.id })
    .from(savedAudiencesTable)
    .where(
      excludedId
        ? and(condition, ne(savedAudiencesTable.id, excludedId))
        : condition,
    )
    .limit(1);
  return rows.length > 0;
}

async function nextVersionedName(baseName: string): Promise<string> {
  for (let version = 2; ; version += 1) {
    const suffix = `-v${version}`;
    const candidate = `${baseName.slice(0, 50 - suffix.length)}${suffix}`;
    if (!(await hasDuplicateName(candidate))) return candidate;
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

router.get("/dooh/audiences", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(savedAudiencesTable)
    .where(sql`(${savedAudiencesTable.data}->>'isActive')::boolean = true`)
    .orderBy(desc(savedAudiencesTable.updatedAt));

  res.json(ListDoohAudiencesResponse.parse(rows.map(toAudience)));
});

router.post("/dooh/audiences", async (req, res): Promise<void> => {
  const parsed = CreateDoohAudienceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: validationMessage(parsed.error) });
    return;
  }

  const geographyValidation = geographyError(
    parsed.data.geoType,
    parsed.data.geoDefinition,
  );
  if (geographyValidation) {
    res.status(400).json({ error: geographyValidation });
    return;
  }

  if (
    parsed.data.plannerVersion === "v2" &&
    !V2_NAME_PATTERN.test(parsed.data.name)
  ) {
    res.status(400).json({
      error:
        "name: V2 audience names must be 5–50 characters using ASCII letters, digits, or hyphens only",
    });
    return;
  }

  const requestedName = parsed.data.name;
  let savedName = requestedName;
  if (await hasDuplicateName(savedName)) {
    if (!parsed.data.allowDuplicate) {
      res.status(409).json({
        error: `An audience named "${requestedName}" already exists`,
      });
      return;
    }
    savedName = await nextVersionedName(requestedName);
  }

  for (;;) {
    const data: AudienceData = {
      name: savedName,
      createdBy: parsed.data.createdBy ?? "DOOH Planner User",
      geoType: parsed.data.geoType,
      geoDefinition: parsed.data.geoDefinition,
      coverage: parsed.data.coverage,
      accountId: parsed.data.accountId ?? "ACC_SHARED",
      ...(parsed.data.linkedBrief !== undefined
        ? { linkedBrief: parsed.data.linkedBrief }
        : {}),
      ...(parsed.data.description !== undefined
        ? { description: parsed.data.description }
        : {}),
      ...(parsed.data.plannerVersion !== undefined
        ? { plannerVersion: parsed.data.plannerVersion }
        : {}),
      ...(parsed.data.plannerFilters !== undefined
        ? { plannerFilters: parsed.data.plannerFilters }
        : {}),
      usageCount: 0,
      isActive: true,
    };

    try {
      const [created] = await db
        .insert(savedAudiencesTable)
        .values({ id: `AUD_${randomUUID()}`, data })
        .returning();
      res.status(201).json(CreateDoohAudienceResponse.parse(toAudience(created)));
      return;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (!parsed.data.allowDuplicate) {
        res.status(409).json({
          error: `An audience named "${requestedName}" already exists`,
        });
        return;
      }
      savedName = await nextVersionedName(requestedName);
    }
  }
});

router.patch("/dooh/audiences/:id", async (req, res): Promise<void> => {
  const params = UpdateDoohAudienceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: validationMessage(params.error) });
    return;
  }
  const parsed = UpdateDoohAudienceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: validationMessage(parsed.error) });
    return;
  }
  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "At least one update field is required" });
    return;
  }

  const [existing] = await db
    .select()
    .from(savedAudiencesTable)
    .where(
      and(
        eq(savedAudiencesTable.id, params.data.id),
        sql`(${savedAudiencesTable.data}->>'isActive')::boolean = true`,
      ),
    );
  if (!existing) {
    res.status(404).json({ error: "Audience not found" });
    return;
  }

  if (
    parsed.data.name &&
    (await hasDuplicateName(parsed.data.name, existing.id))
  ) {
    res.status(409).json({
      error: `An audience named "${parsed.data.name}" already exists`,
    });
    return;
  }

  const nextData: AudienceData = {
    ...existing.data,
    ...parsed.data,
    geoDefinition:
      parsed.data.geoDefinition ?? existing.data.geoDefinition,
  };
  if (
    nextData.plannerVersion === "v2" &&
    !V2_NAME_PATTERN.test(nextData.name)
  ) {
    res.status(400).json({
      error:
        "name: V2 audience names must be 5–50 characters using ASCII letters, digits, or hyphens only",
    });
    return;
  }
  const geographyValidation = geographyError(
    nextData.geoType,
    nextData.geoDefinition,
  );
  if (geographyValidation) {
    res.status(400).json({ error: geographyValidation });
    return;
  }

  try {
    const [updated] = await db
      .update(savedAudiencesTable)
      .set({ data: nextData, updatedAt: new Date() })
      .where(eq(savedAudiencesTable.id, existing.id))
      .returning();
    res.json(UpdateDoohAudienceResponse.parse(toAudience(updated)));
  } catch (error) {
    if (isUniqueViolation(error)) {
      res.status(409).json({
        error: `An audience named "${nextData.name}" already exists`,
      });
      return;
    }
    throw error;
  }
});

router.delete("/dooh/audiences/:id", async (req, res): Promise<void> => {
  const params = ArchiveDoohAudienceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: validationMessage(params.error) });
    return;
  }

  const [existing] = await db
    .select()
    .from(savedAudiencesTable)
    .where(
      and(
        eq(savedAudiencesTable.id, params.data.id),
        sql`(${savedAudiencesTable.data}->>'isActive')::boolean = true`,
      ),
    );
  if (!existing) {
    res.status(404).json({ error: "Audience not found" });
    return;
  }

  const [archived] = await db
    .update(savedAudiencesTable)
    .set({
      data: { ...existing.data, isActive: false },
      updatedAt: new Date(),
    })
    .where(eq(savedAudiencesTable.id, existing.id))
    .returning();
  res.json(ArchiveDoohAudienceResponse.parse(toAudience(archived)));
});

router.post("/dooh/audiences/:id/use", async (req, res): Promise<void> => {
  const params = UseDoohAudienceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: validationMessage(params.error) });
    return;
  }

  const [updated] = await db
    .update(savedAudiencesTable)
    .set({
      data: sql`jsonb_set(
        ${savedAudiencesTable.data},
        '{usageCount}',
        to_jsonb(((${savedAudiencesTable.data}->>'usageCount')::integer + 1))
      )`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(savedAudiencesTable.id, params.data.id),
        sql`(${savedAudiencesTable.data}->>'isActive')::boolean = true`,
      ),
    )
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Audience not found" });
    return;
  }
  res.json(UseDoohAudienceResponse.parse(toAudience(updated)));
});

export default router;