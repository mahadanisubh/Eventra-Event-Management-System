import { Router } from "express";
import { createUser,loginUser,getProfile,verifyOTP } from "../controllers/user.controller.js";
import { createEvent,getEvents,getMyEvents,getEventById,updateEvent,deleteEvent,addComment,getCommentsByEvent } from "../controllers/event.controller.js";
import { registerInEvent } from "../controllers/join.event.controller.js";
import { exportRegistrationCSV, getDailyRegistration, getEventRegistrations, getEventStats, getOverview, getTopEvents } from "../controllers/admin.analytics.controller.js";
import {authMiddleware, isRole} from "../middleware/protect.middleware.js";
import { upload } from "../middleware/user.middleware.js";
const router = Router();

router.post("/createuser",createUser);
router.post("/loginuser",loginUser);
router.post("/createevent",authMiddleware,isRole,upload.single("bannerImage"),createEvent);
router.post("/registerinevent/:eventId",authMiddleware,registerInEvent);
router.get("/getevents",getEvents);
router.get("/myevents",authMiddleware,isRole,getMyEvents);
router.get("/myprofile",authMiddleware,getProfile);
router.get("/geteventbyid/:eventId",getEventById);
router.put("/updateevent/:eventId",authMiddleware,isRole,upload.single("bannerImage"),updateEvent);
router.delete("/deleteevent/:eventId",authMiddleware,isRole,deleteEvent);
router.post("/comment/:eventId", authMiddleware, addComment);
router.get("/comments/:eventId", getCommentsByEvent);
router.post("/verify-otp", verifyOTP);
router.get("/myevents/:eventId/registrations",authMiddleware,isRole,getEventRegistrations);
router.get("/myevents/:eventId/export-csv",authMiddleware,isRole,exportRegistrationCSV);
router.get("/analytics/overview", authMiddleware, isRole, getOverview);
router.get("/analytics/geteventstats",authMiddleware, isRole, getEventStats);
router.get("/analytics/gettopevents",authMiddleware,isRole,getTopEvents);
router.get("/analytics/getdailyregistrations",authMiddleware,isRole,getDailyRegistration)

export default router;