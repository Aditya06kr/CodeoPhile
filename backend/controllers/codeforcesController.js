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
    const clan = await Clan.findOne({ name: clanName });
    clan.members = [...clan.members, { user_id: username }];
    const updatedClan = await clan.save();
    console.log(updatedClan);
  } catch (err) {
    console.log(err);
  }
};

export const allMembers = async (req, res) => {
  const {clanName}=req.params;
  try{
    const clan = await Clan.findOne({name:clanName});
    if(!clan) throw new Error("Clan not Found");
    const memberArray=clan.members.map(member => member.user_id);
    res.json(memberArray);
  }catch(err){
    console.log(err);
  }
};

export const standingsInfo = async (req,res)=>{
  const {user}=req.params;
  try{
    const response=await axios.get(`https://codeforces.com/api/user.info?handles=${user}`)
    res.json(response.data);
  }catch(err){
    console.log(err);
  }
};

export const totalContests = async (req,res)=>{
  const {user} = req.params;
  try{
    const response=await axios.get(`https://codeforces.com/api/user.rating?handle=${user}`)
    res.json(response.data);
  }catch(err){
    console.log(err);
  }
}