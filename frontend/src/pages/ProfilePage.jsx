import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Image } from "antd";
import Loader from "../components/Loader";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Sector,
} from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {(payload.verdict==="OK" ? "ACCEPTED" : payload.verdict)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Occur ${(percent * 100).toFixed(2)}% times)`}
      </text>
    </g>
  );
};

const ProfilePage = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userContestDetails, setUserContestDetails] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loader, setLoader] = useState(true);
  const [contest, setContest] = useState({ id: "", name: "", rating: 0 });
  const [verdictCount,setVerdictCount]=useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    if (userStatus) {
      const verdictCounter = userStatus.reduce((acc, curr) => {
        acc[curr.verdict] = (acc[curr.verdict] || 0) + 1;
        return acc;
      }, {});

      const verdictArray = Object.entries(verdictCounter).map(([verdict, value]) => ({
        verdict,
        value
      }));

      setVerdictCount(verdictArray);
    }
  }, [userStatus]);

  useEffect(() => {
    if (userContestDetails) {
      const contestArray = userContestDetails.map((value) => ({
        id: value.contestId,
        name: value.contestName,
        rating: value.newRating,
      }));
      setContest([{ id: "", name: "", rating: 0 }, ...contestArray]);
    }
  }, [userContestDetails]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(`/codeforces/standings/${username}`);
        setUserDetails(res1.data.result[0]);

        await sleep(1000);

        const res2 = await axios.get(`/codeforces/totalcontests/${username}`);
        setUserContestDetails(res2.data.result);

        await sleep(1000);

        const res3 = await axios.get(`/codeforces/userstatus/${username}`);
        setUserStatus(res3.data.result);

        await sleep(2000);
        setLoader(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [username]);
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-screen ">
          <h1>Dashboard :- {username}</h1>
          <div className="flex bg-pink-100 justify-around">
            <div className="flex flex-col">
              <span>
                Name :-{" "}
                <span>
                  {userDetails.firstName + " " + userDetails.lastName}
                </span>
              </span>
              <span>
                Rating :- <span>{userDetails.rating}</span>
              </span>
              <span>
                Title :- <span>{userDetails.rank}</span>
              </span>
              <span>
                Organization :- <span>{userDetails.organization}</span>
              </span>
              <span>
                Friends :- <span>{userDetails.friendOfCount}</span>
              </span>
            </div>
            <div>
              <Image width={500} src={userDetails.titlePhoto} />
            </div>
          </div>
          <div className="flex justify-center">
            <AreaChart
              width={1200}
              height={400}
              data={contest}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="#8884d8"
                // fillOpacity={1}
                fill="#8884d8"
              />
            </AreaChart>
          </div>
          <div>
            <PieChart width={600} height={600}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={verdictCount}
                cx={200}
                cy={200}
                innerRadius={100}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              />
            </PieChart>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
