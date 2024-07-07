import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [enabled, setEnabled] = useState(true);
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo) {
      axios
        .get(`/user/dashboard/${userInfo.email}`)
        .then((res) => {
          if (res.data) {
            setEnabled(false);
          } else setEnabled(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo]);

  async function updateUsername() {
    try {
      const res = await axios.get(`/codeforces/checkuser/${username}`);
      console.log(res.data);
      if (res.data.status === "FAILED") {
        toast.error("Invalid Handle");
        return;
      }

      axios
        .post("/user/details", { email: userInfo.email, CfId: username })
        .then((res) => {
          setEnabled(false);
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            cfId: username,
          }));
          toast.success(res.data);
        })
        .catch((err) => {
          toast.error("Not Linked");
          console.log("Error in linking :- ", err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  function handleClick() {}
  return (
    <>
      <div>DashBoard</div>
      {enabled && (
        <>
          <input
            type="text"
            placeholder="Enter Your CF username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={updateUsername}>&rarr;</button>
        </>
      )}
      {!enabled && (
        <div>
          <h1>Groups</h1>
          
        </div>
      )}
    </>
  );
};

export default Dashboard;
