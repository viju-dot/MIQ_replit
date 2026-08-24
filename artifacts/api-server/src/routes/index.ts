import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sharesRouter from "./shares";
import annotationsRouter from "./annotations";
import prototypeCollaborationRouter from "./prototypeCollaboration";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sharesRouter);
router.use(annotationsRouter);
router.use(prototypeCollaborationRouter);

export default router;
