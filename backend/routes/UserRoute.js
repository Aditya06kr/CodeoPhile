import { Router } from "express";
import { codeforces_Id,createUser } from "../controllers/userController.js";

const router = Router();

router.route("/dashboard/:email").get(codeforces_Id);
router.route("/details").post(createUser)

export default router;
