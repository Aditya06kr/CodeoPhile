import {Router} from "express";
import { addMember, allMembers, checkUser, createClan, standingsInfo, totalContests, userStatus } from "../controllers/codeforcesController.js";

const router=Router();

router.route("/checkuser/:username").get(checkUser);
router.route("/createclan").post(createClan);
router.route("/members").post(addMember);
router.route("/members/:clanName").get(allMembers);
router.route("/totalcontests/:user").get(totalContests);
router.route("/standings/:user").get(standingsInfo);
router.route("/userstatus/:username").get(userStatus);

export default router;