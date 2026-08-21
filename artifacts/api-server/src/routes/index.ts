import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sharesRouter from "./shares";
import annotationsRouter from "./annotations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sharesRouter);
router.use(annotationsRouter);

export default router;
