import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, updateUser, getUserById, getUsers } from "../controllers/userController.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

router.get("/get-user/:id", getUserById); // Route to get user by ID
router.get("/", getUsers);//get all users

export default router;
