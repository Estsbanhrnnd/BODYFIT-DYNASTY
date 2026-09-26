import { Router, type IRouter } from "express";
import foodAnalysisRouter from "./food-analysis";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(foodAnalysisRouter);

export default router;
