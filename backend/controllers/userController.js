import User from "../models/User.js";
import mongoose from "mongoose";

export const codeforces_Id = async (req, res) => {
  const { email } = req.params;

  try {
    const doc = await User.findOne({ email }, { CfId: 1 });
    res.json(doc);
  } catch (err) {
    console.log(err);
  }
};

export const createUser = async (req, res) => {
  const { email, CfId } = req.body;
  try {
    await User.create({
      email,
      CfId,
    });
    res.json("Cf id successfully Linked");
  } catch (err) {
    console.log(err);
  }
};
