import React, { useEffect, useState } from "react";
import {
  Col,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import { teamInfo, toolInfo, apiInfo, repoAndAPI } from "./AboutInfo.js";
import { Card as MatCard } from "@mui/material";
import {
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
} from "@mui/material";
// import "../../styles/About.css";
import Navbar from './Navbar'

async function getGitlabInfo() {
    let totalCommitCount = 0, totalIssueCount = 0, totalTestCount = 0;

    let pageNum = 1;
    let commitList = [];
    let commits = [];

    // Get all the commits made from GitLab
    do {
        commitList = await fetch(`https://gitlab.com/api/v4/projects/39586539/repository/commits?per_page=100&page=${pageNum}&all=true`);
        commitList = await commitList.json();
        commits.push(...commitList);
        pageNum += 1;
        console.log(`pageNum: ${pageNum}  length: ${commitList.length}`)
    } while (commitList.length > 0);

    // Calculate which commits belong to whom
    commits.forEach(commit => {
        const {author_name, author_email} = commit;
        teamInfo.forEach(member => {
            if (member.Name == author_name || member.Username == author_name || member.Email == author_email) {
                member.Commits += 1;
            }
        })
        totalCommitCount += 1;
    });

    pageNum = 1;
    let issueList = [];
    let issues = [];

    // Get all the issues made from GitLab
    do {
        issueList = await fetch(`https://gitlab.com/api/v4/projects/39586539/issues?per_page=100&page=${pageNum}&scope=all`);
        issueList = await issueList.json();
        issues.push(...issueList);
        pageNum += 1;
    } while (issueList.length > 0);

    // Calculate which issues were closed by whom
    issues.forEach(issue => {
        const {closed_by} = issue;
        if (closed_by == null) {
            return; // Issue not yet closed, look at next issue
        }
        const {name, username} = closed_by;
        teamInfo.forEach(member => {
            if (member.Name == name || member.Username == username || member.Name == username) {
                member.Issues += 1;
            }
        })
        totalIssueCount += 1;
    });

    // Calculate total tests
    teamInfo.forEach(member => {
        totalTestCount += member.Tests
    })

    return {
        teamList: teamInfo,
        totalCommits: totalCommitCount,
        totalIssues: totalIssueCount,
        totalTests: totalTestCount
    }
}

function About() {
    const [teamList, setTeamList] = useState([]);
    const [totalCommits, setTotalCommits] = useState(0);
    const [totalIssues, setTotalIssues] = useState(0);
    const [totalTests, setTotalTests] = useState(0);

    // TODO: decide if running on first render only or when team members updates
    useEffect(() => {
        const fetchData = async () => {
            const gitlabInfo = await getGitlabInfo();
            setTeamList(gitlabInfo.teamList);
            setTotalCommits(gitlabInfo.totalCommits);
            setTotalIssues(gitlabInfo.totalIssues);
            setTotalTests(gitlabInfo.totalTests);
        }
        fetchData();
    }, [])

    return (
        <Container className="wrapper">
            <h1>About Us</h1>
            <Container>
                <p>
                A reference webpage to local Austin restaurants that displays statistics for restaurants in the city, 
                recipes for menu items which you can try on your own, and types of cuisines in Austin. There will be 
                an emphasis placed on supporting local businesses, connecting popular menu items to recipes which you 
                can try for yourself, and being able to try similar dishes across different cuisines.
                </p>
            </Container>
            <h1 className="wrapper">Team Members</h1>
            <Stack direction="row" justifyContent="center" spacing={2}> {/* gap="32px" */}
                {teamList.map((member) => {
                return (
                    <MatCard className="bioCard" key={member.Name + "-card"} style={{ width: "18rem" }}>
                    {/* <Card.Img variant="top" src={member.Photo} /> */}
                    <CardContent>
                        <Card.Title>{member.Name}</Card.Title>
                        <Card.Subtitle>{member.Role}</Card.Subtitle>
                        <Card.Text>{member.Bio}</Card.Text>
                        <ListGroup>
                            <ListGroupItem>Commits: {member.Commits}</ListGroupItem>
                            <ListGroupItem>Issues: {member.Issues}</ListGroupItem>
                            <ListGroupItem>Tests: {member.Tests}</ListGroupItem>
                        </ListGroup>
                    </CardContent>
                    </MatCard>
                );
                })}
            </Stack>
        </Container>
    );
  }
  
export default About;
  