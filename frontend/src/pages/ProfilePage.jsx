import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Image } from "antd";
import Loader from "../components/Loader";
import PieChartForTags from "../components/PieChartForTags";
import PieChartForVerdict from "../components/PieChartForVerdict";
import BarChartForRatings from "../components/BarChartForRatings";
import AreaChartForRatings from "../components/AreaChartForRatings";

const ProfilePage = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userContestDetails, setUserContestDetails] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loader, setLoader] = useState(true);
  const [contest, setContest] = useState({ id: "", name: "", rating: 0 });
  const [verdictCount, setVerdictCount] = useState();
  const [tags, setTags] = useState();
  const [ratingFreq, setRatingFreq] = useState();
  const [solved, setSolved] = useState(0);
  const [tried, setTried] = useState();
  const [skipped, setSkipped] = useState(0);
  const [userRank, setUserRank] = useState();
  const [ratingChange, setRatingChange] = useState();
  const [maxWrongAccepted, setMaxWrongAccepted] = useState();
  const [maxWrong, setMaxWrong] = useState();
  const [singleSubmission, setSingleSubmission] = useState();
  const [lastActive, setLastActive] = useState();
  const [lastContest, setLastContest] = useState();

  const getBestAndWorstRank = () => {
    let bestRank = Infinity;
    let worstRank = -Infinity;

    userContestDetails.forEach((contest) => {
      bestRank = Math.min(bestRank, contest.rank);
      worstRank = Math.max(worstRank, contest.rank);
    });

    return { bestRank, worstRank };
  };

  const getMaxAndMinRatingChange = () => {
    let Positive = -Infinity;
    let Negative = Infinity;

    userContestDetails.forEach((contest) => {
      const difference = contest.newRating - contest.oldRating;
      Positive = Math.max(Positive, difference);
      Negative = Math.min(Negative, difference);
    });

    return { Positive, Negative };
  };

  const getCountOfOnlyOkVerdicts = () => {
    const okOnlyQuestions = new Set();

    userStatus.forEach((status) => {
      const questionId = `${status.problem.contestId}-${status.problem.index}`;

      if (status.verdict === "OK") {
        okOnlyQuestions.add(questionId);
      } else {
        if (okOnlyQuestions.has(questionId)) {
          okOnlyQuestions.delete(questionId);
        }
      }
    });

    return okOnlyQuestions.size;
  };

  const getMaxNonOkVerdicts = () => {
    const nonOkCounts = {};
    const okEncountered = new Set();

    userStatus.forEach((status) => {
      const questionId = `${status.problem.contestId}-${status.problem.index}`;

      if (okEncountered.has(questionId)) {
        return;
      }

      if (status.verdict !== "OK") {
        if (!nonOkCounts[questionId]) {
          nonOkCounts[questionId] = 0;
        }
        nonOkCounts[questionId]++;
      } else {
        okEncountered.add(questionId);
      }
    });

    let count = 0;
    let question = null;

    for (const questionId in nonOkCounts) {
      if (!okEncountered.has(questionId) && nonOkCounts[questionId] > count) {
        count = nonOkCounts[questionId];
        question = questionId;
      }
    }

    return {
      count,
      question,
    };
  };

  const getMaxNonOkVerdictsBeforeOk = () => {
    const nonOkCounts = {};
    const okEncountered = new Set();

    for (let i = userStatus.length - 1; i >= 0; i--) {
      const status = userStatus[i];
      const questionId = `${status.problem.contestId}-${status.problem.index}`;

      if (okEncountered.has(questionId)) {
        continue;
      }

      if (status.verdict === "OK") {
        okEncountered.add(questionId);
        continue;
      }

      if (!nonOkCounts[questionId]) {
        nonOkCounts[questionId] = 0;
      }
      nonOkCounts[questionId]++;
    }

    let count = 0;
    let question = null;

    for (const questionId in nonOkCounts) {
      if (nonOkCounts[questionId] > count) {
        count = nonOkCounts[questionId];
        question = questionId;
      }
    }

    return {
      count,
      question,
    };
  };

  const getVerdicts = () => {
    const verdictCounter = userStatus.reduce((acc, curr) => {
      acc[curr.verdict] = (acc[curr.verdict] || 0) + 1;
      return acc;
    }, {});

    const verdictArray = Object.entries(verdictCounter).map(
      ([verdict, value]) => ({
        verdict,
        value,
      })
    );
    return verdictArray;
  };

  const getLastSubmissionDaysAgo = () => {
    if (userStatus.length === 0) {
      return null;
    }

    const lastSubmissionTime = userStatus[0].creationTimeSeconds;

    const currentTime = Math.floor(Date.now() / 1000);

    const differenceInSeconds = currentTime - lastSubmissionTime;

    const daysAgo = Math.floor(differenceInSeconds / (60 * 60 * 24));

    return daysAgo;
  };

  const getLastContestDaysAgo = () => {
    if (userContestDetails.length === 0) {
      return null;
    }

    const lastContest = userContestDetails[userContestDetails.length - 1];

    const lastContestEndTime = lastContest.ratingUpdateTimeSeconds;

    const currentTime = Math.floor(Date.now() / 1000);

    const differenceInSeconds = currentTime - lastContestEndTime;

    const daysAgo = Math.floor(differenceInSeconds / (60 * 60 * 24));

    return daysAgo;
  };

  const getSkippedContestsCount = () => {
    const skippedStatus = userStatus.filter(
      (status) => status.verdict === "SKIPPED"
    );

    const uniqueContestsSet = new Set();
    skippedStatus.forEach((status) => {
      uniqueContestsSet.add(status.contestId);
    });

    return uniqueContestsSet.size;
  };

  const getAllTags = () => {
    const tagFrequency = {};

    userStatus.forEach((status) => {
      status.problem.tags.forEach((tag) => {
        if (tagFrequency[tag]) {
          tagFrequency[tag]++;
        } else {
          tagFrequency[tag] = 1;
        }
      });
    });

    const tagFrequencyArray = Object.keys(tagFrequency).map((tag) => ({
      name: tag,
      value: tagFrequency[tag],
    }));

    return tagFrequencyArray;
  };

  const getAcceptedRatingsFrequency = () => {
    const uniqueProblemsSet = new Set();
    const uniqueAcceptedStatus = userStatus.filter((status) => {
      const problemIdentifier = `${status.problem.contestId}-${status.problem.index}`;
      if (uniqueProblemsSet.has(problemIdentifier)) {
        return false;
      } else {
        uniqueProblemsSet.add(problemIdentifier);
        return true;
      }
    });

    setTried(uniqueAcceptedStatus.length);

    const acceptedStatus = uniqueAcceptedStatus.filter(
      (status) => status.verdict === "OK"
    );

    let solvedQuestion = 0;
    const ratingsFrequency = acceptedStatus.reduce((freqMap, status) => {
      const { rating } = status.problem;
      if (!isNaN(rating)) {
        solvedQuestion++;
        if (freqMap[rating]) {
          freqMap[rating] += 1;
        } else {
          freqMap[rating] = 1;
        }
      }
      return freqMap;
    }, {});

    setSolved(solvedQuestion);

    const ratingsFrequencyArray = Object.keys(ratingsFrequency).map((key) => ({
      name: key.toString(),
      value: ratingsFrequency[key],
    }));

    return ratingsFrequencyArray;
  };

  useEffect(() => {
    if (userStatus) {
      setVerdictCount(getVerdicts());

      setTags(getAllTags());

      setRatingFreq(getAcceptedRatingsFrequency());

      setSkipped(getSkippedContestsCount());

      setUserRank(getBestAndWorstRank());

      setRatingChange(getMaxAndMinRatingChange());

      setMaxWrongAccepted(getMaxNonOkVerdictsBeforeOk());

      setMaxWrong(getMaxNonOkVerdicts());

      setSingleSubmission(getCountOfOnlyOkVerdicts());

      setLastActive(getLastSubmissionDaysAgo());

      setLastContest(getLastContestDaysAgo());
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
        <div className="flex flex-col h-full">
          <h1>Dashboard :- {username}</h1>
          <div className="flex justify-around">
            <div className="flex flex-col">
              <span>
                Name :-{" "}
                <span>
                  {userDetails.firstName && userDetails.lastName
                    ? `${userDetails.firstName} ${userDetails.lastName}`
                    : userDetails.firstName || userDetails.lastName || "NA"}
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
              <span>
                Last Active :-
                <span>
                  {lastActive == 0
                    ? "Today"
                    : lastActive == 1
                    ? "1 day ago"
                    : `${lastActive} days ago`}
                </span>
              </span>
              <span>
                Last Contest :-
                <span>
                  {!lastContest
                    ? "Yet to Give"
                    : lastContest == 0
                    ? "Today"
                    : lastContest == 1
                    ? "1 day ago"
                    : `${lastContest} days ago`}
                </span>
              </span>
            </div>
            <div>
              <Image width={500} src={userDetails.titlePhoto} />
            </div>
          </div>
          <div className="flex justify-center">
            <AreaChartForRatings data={contest} />
          </div>
          <div className="flex justify-center border border-black mt-10">
            <PieChartForVerdict data={verdictCount} />
          </div>
          <div className="flex justify-center border border-black mt-10 overflow-auto">
            <PieChartForTags data={tags} />
          </div>
          <div className="flex justify-center mt-10 border border-black">
            <BarChartForRatings data={ratingFreq} />
          </div>
          <div className="flex justify-center w-full gap-4">
            <div className="flex flex-col w-1/3">
              <div className="text-center">Contests</div>
              <div className="flex justify-between">
                <span>Total Contest</span>
                <span>{userContestDetails.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Skipped</span>
                <span>{skipped}</span>
              </div>
              <div className="flex justify-between">
                <span>Best Rank</span>
                <span>
                  {userRank.bestRank === Infinity ? NA : userRank.bestRank}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Worst Rank</span>
                <span>
                  {userRank.worstRank === -Infinity ? NA : userRank.worstRank}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Positive</span>
                <span>
                  {ratingChange.Positive === -Infinity
                    ? NA
                    : ratingChange.Positive}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Negative</span>
                <span>
                  {ratingChange.Negative === Infinity
                    ? NA
                    : ratingChange.Negative}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <div className="text-center">Problems</div>
              <div className="flex justify-between">
                <span>Total Tried</span>
                <span>{tried}</span>
              </div>
              <div className="flex justify-between">
                <span>Solved</span>
                <span>{solved}</span>
              </div>
              <div className="flex justify-between">
                <span>Unsolved</span>
                <span>{tried - solved}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Wrong (Solved)</span>
                <span>
                  {maxWrongAccepted.count} {maxWrongAccepted.question}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Wrong (Unsolved)</span>
                <span>
                  {maxWrong.count} {maxWrong.question}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Solved in 1 Submission</span>
                <span>{singleSubmission}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
