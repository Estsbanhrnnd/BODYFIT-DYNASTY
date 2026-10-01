import { Router, type IRouter } from "express";
import foodAnalysisRouter from "./food-analysis";
import healthRouter from "./health";
import profilesRouter from "./profiles";
import communityRouter from "./community";
import storeRouter from "./store";
import activityRouter from "./activity";
import adminRouter from "./admin";
import giftCodesRouter from "./gift-codes";
import socialRouter from "./social";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(foodAnalysisRouter);
router.use(profilesRouter);
router.use(communityRouter);
router.use(storeRouter);
router.use(activityRouter);
router.use(adminRouter);
router.use(giftCodesRouter);
router.use("/social", socialRouter);
router.use("/notifications", notificationsRouter);

export default router;
