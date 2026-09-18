import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sharesRouter from "./shares";
import annotationsRouter from "./annotations";
import prototypeCollaborationRouter from "./prototypeCollaboration";
import doohAudiencesRouter from "./doohAudiences";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sharesRouter);
router.use(annotationsRouter);
router.use(prototypeCollaborationRouter);
router.use(doohAudiencesRouter);

export default router;
