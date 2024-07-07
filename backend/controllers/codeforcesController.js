import axios from "axios";

export const checkUser = async (req, res) => {
  const { username } = req.params;
  try {
    await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    res.json({ status: "OK" });
  } catch (err) {
    res.json({ status: "FAILED" });
  }
};
