import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import enrollmentsRouter from "./enrollments";
import contactRouter from "./contact";
import leadsRouter from "./leads";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";
import faqsRouter from "./faqs";
import formFieldsRouter from "./formFields";
import adminRouter from "./admin";

import siteContentRouter from "./siteContent";
import siteAssetsRouter from "./siteAssets";
import landingPagesRouter from "./landingPages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(enrollmentsRouter);
router.use(contactRouter);
router.use(leadsRouter);
router.use(testimonialsRouter);
router.use(statsRouter);
router.use(faqsRouter);
router.use(formFieldsRouter);
router.use(adminRouter);
router.use(siteContentRouter);
router.use(siteAssetsRouter);
router.use(landingPagesRouter);

export default router;

