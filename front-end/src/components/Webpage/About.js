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
    let commitList = await fetch("https://gitlab.com/api/v4/projects/39586539/repository/commits?per_page=100&page=1&all=true")

    commitList = await commitList.json()
    commitList.forEach(commit => {
        totalCommitCount += 1;
    });

    return {
        teamList: teamInfo,
        totalCommits: totalCommitCount,
        totalIssues: 0,
        totalTests: 0
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
                TODO: Add description here.
                </p>
            </Container>
            <h1 className="wrapper">Team Members</h1>
            <Stack direction="row" justifyContent="center" spacing={2}> {/* gap="32px" */}
                {teamList.map((member) => {
                return (
                    <MatCard className="bioCard" style={{ width: "18rem" }}>
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
  