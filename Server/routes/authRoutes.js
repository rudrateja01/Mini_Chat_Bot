import express from "express";
import { signup, login ,getAllUsers,deleteUser,getAdmin,updateDetails,getUser } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);


router.get("/users", auth,getAllUsers);
router.delete("/users/:id", auth,requireAdmin, deleteUser); 

// admin details
router.get("/admin", auth, getAdmin); 
router.put("/admin", auth, updateDetails); 

// get single user
router.get("/user", auth, getUser);
router.put("/user", auth, updateDetails)

export default router;
