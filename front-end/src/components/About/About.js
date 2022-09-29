import React, { useEffect, useState } from 'react';
import Navbar from '../Webpage/Navbar'

async function getGitlabInfo() {
    let totalCommitCount = 0, totalIssueCount = 0, totalTestCount = 0;
    let commitList = await fetch("https://gitlab.com/api/v4/projects/39586539/repository/commits?per_page=100&page=1&all=true")

    commitList = await commitList.json()
    commitList.forEach(commit => {
        totalCommitCount += 1;
    });

    return {
        totalCommits: totalCommitCount
    }
}

function About() {
    // const [teamList, setTeamList] = useState([]);
    const [totalCommits, setTotalCommits] = useState(0);
    // const [totalIssues, setTotalIssues] = useState(0);
    // const [totalTests, setTotalTests] = useState(0);

    console.log("waiting")

    useEffect(() => {
        const fetchData = async () => {
            const gitlabInfo = await getGitlabInfo();
            setTotalCommits(gitlabInfo.totalCommits);
            // setTotalIssues(gitlabInfo.totalIssues);
            // setTotalTests(gitlabInfo.totalTests);
            // setTeamList(gitlabInfo.teamInfo);
        }
        fetchData();
    }, [])

    console.log(totalCommits)

    return (
        <div className="about">
            Total Commits: {totalCommits}
        </div>

    );
  }
  
export default About;
  