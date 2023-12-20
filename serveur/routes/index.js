import express from "express";
import chatRoute from "./chatRoute.js";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import MessageRoute from "./messageRoute.js";


const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute);

router.use(`${path}chat`, chatRoute)
router.use(`${path}message`, MessageRoute)


export default router;
