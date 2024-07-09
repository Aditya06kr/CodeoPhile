import mongoose from "mongoose";

const clanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    members: [
      {
        user_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Clan = mongoose.model("Clan", clanSchema);

export default Clan;
