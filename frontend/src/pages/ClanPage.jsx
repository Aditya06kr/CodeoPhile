import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useLocation } from "react-router-dom";
import Standings from "../components/Standings";
import Loader from "../components/Loader";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Clan = () => {
  const query = useQuery();
  const clanName = query.get("name");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [membersInfo, setMembersInfo] = useState([]);
  const [option,setOption] = useState("");
  const [loader,setLoader]=useState(false);

  async function addMember() {
    try {
      const res = await axios.post("/codeforces/members", {
        clanName,
        username,
      });
      console.log(res.data);
      setUsername("");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (members.length > 0) {
      generateStandings();
    }
  }, [members]);

  function invokeFunctions() {
    setLoader(true);
    generateMembers();
    setOption("members");
  }

  async function generateMembers() {
    try {
      const res = await axios.get(`/codeforces/members/${clanName}`);
      setMembers(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function generateStandings() {
    try {
      const results = [];
      for (const user of members) {
        const userObject = { username: user };

        // First request
        const res1 = await axios.get(`/codeforces/standings/${user}`);
        const data1 = res1.data.result[0];

        userObject.title = data1.rank;
        userObject.curr_rating = data1.rating;
        userObject.max_rating = data1.maxRating;

        // Delay before the next request
        await sleep(1000); // Wait for 1 second to avoid rate limit

        // Second request
        const res2 = await axios.get(`/codeforces/totalcontests/${user}`);
        const data2 = res2.data.result;
        userObject.contests = data2.length;

        results.push(userObject);

        // Delay before the next user's requests
        await sleep(1000); // Wait for 1 second to avoid rate limit
      }

      setMembersInfo(results);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex justify-between p-4">
          <h1>{clanName}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add a Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Grow your Clan</DialogTitle>
                <DialogDescription>
                  Add Codeforces ID of the user
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    UserName
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={addMember}>
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="p-2 flex  gap-4">
          <button
            onClick={invokeFunctions}
            className="p-2 border rounded-full border-black"
          >
            Members
          </button>
          <button className="p-2 border rounded-full border-black">
            Compare
          </button>
        </div>
        {option==="members" && (loader ? <Loader/> : <Standings membersInfo={membersInfo} />)}
      </div>
    </>
  );
};

export default Clan;
