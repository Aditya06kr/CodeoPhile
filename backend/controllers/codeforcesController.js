import axios from "axios";
import Clan from "../models/Clan.js";

export const checkUser = async (req, res) => {
  const { username } = req.params;
  try {
    await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    res.json({ status: "OK" });
  } catch (err) {
    res.json({ status: "FAILED" });
  }
};

export const allClans = async (req, res) => {
  const { Cf_Id } = req.params;
  try {
    const response = await Clan.find({
      $or: [{ createdBy: Cf_Id, "members.user_id": Cf_Id }],
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

export const createClan = async (req, res) => {
  const { clanName, createdBy } = req.body;
  console.log(clanName, createdBy);
  try {
    const response = await Clan.create({
      name: clanName,
      createdBy,
      members: [],
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

export const addMember = async (req, res) => {
  const { clanName, username } = req.body;
  console.log(clanName);
  try {
    const clan = await Clan.findOne({name:clanName});
    clan.members=[...clan.members,{user_id:username}];
    const updatedClan = await Clan.save();
    console.log(updatedClan);
  } catch (err) {
    console.log(err);
  }
};
