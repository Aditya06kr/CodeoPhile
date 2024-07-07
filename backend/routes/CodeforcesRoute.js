import {Router} from "express";
import { checkUser } from "../controllers/codeforcesController.js";

const router=Router();

router.route("/checkuser/:username").get(checkUser);

export default router;