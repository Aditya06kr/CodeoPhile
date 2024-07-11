import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [clans, setClans] = useState([]);
  const [clanName, setClanName] = useState("");
  const { userInfo, setUserInfo } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(userInfo?.email);
    console.log(userInfo?.cfId);
    if (userInfo) {
      axios
        .get(`/user/dashboard/${userInfo.email}`)
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setEnabled(false);
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              CfId: res.data.CfId,
            }));
          } else setEnabled(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo?.email]);

  useEffect(() => {
    if (userInfo && userInfo.cfId) {
      // axios
      //   .get(`/codeforces/Clans/${userInfo.cfId}`)
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }
  }, [userInfo, enabled]);

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
            CfId: username,
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

  function createClan() {
    // console.log(userInfo);
    try {
      axios
        .post("/codeforces/createclan", { clanName, createdBy: userInfo.CfId })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      navigate(`/clan?name=${clanName}`);
      setClanName("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div>DashBoard</div>
      {enabled ? (
        <>
          <input
            type="text"
            placeholder="Enter Your CF username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={updateUsername}>&rarr;</button>
        </>
      ) : (
        !enabled && (
          <>
            <div className="flex justify-between p-4">
              <h1>Your Clans :- </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Form a Clan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make your own Clan</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Clan Name
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3"
                        value={clanName}
                        onChange={(e) => setClanName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={createClan}
                      >
                        Done
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )
      )}
    </>
  );
};

export default Dashboard;
