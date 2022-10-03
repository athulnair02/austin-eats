import React, { useEffect, useState } from "react";
import {
  Col,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import { teamInfo, toolInfo, dataSourceInfo, repoAndAPI } from "./AboutInfo.js";
import { Card as MatCard } from "@mui/material";
import {
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
} from "@mui/material";
import "./About.css";
import Navbar from './Navbar'

async function getGitlabInfo() {
    let totalCommitCount = 0, totalIssueCount = 0, totalTestCount = 0;

    // Reset all member stats before calculations
    teamInfo.forEach(member => {
        member.Commits = 0
        member.Issues = 0
    })

    let pageNum = 1;
    let commitList = [];
    let commits = [];

    // Get all the commits made from GitLab
    do {
        commitList = await fetch(`https://gitlab.com/api/v4/projects/39586539/repository/commits?per_page=100&page=${pageNum}&all=true`);
        commitList = await commitList.json();
        commits.push(...commitList);
        pageNum += 1;
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
                totalIssueCount += 1;
            }
        })
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
                recipes for menu items which you can try on your own, and types of cuisines in Austin. We are here to
                help and support local businesses, connecting popular menu items to recipes which you can try for
                yourself, and being able to try similar dishes across different cuisines. If you are a foodie or love 
                cooking, this website is for you!
                </p>
                <p>
                We connect data from several sources so you, the user, can be well informed on various restaurants, 
                recipes, and cultures. We hope you find something you didn't know you were looking for!
                </p>
            </Container>

            <h1 className="wrapper">Team Members</h1>
            <Stack direction="row" justifyContent="center" spacing={2}> 
                {teamList.map((member) => {
                return (
                    <MatCard className="bioCard" key={member.Name + "-card"} style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={member.Photo}/>
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

            <h1>Repository Statistics</h1>
            <Container>
                <div className="repoStats">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Total Commits</th>
                        <th>Total Issues</th>
                        <th>Total Tests</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{totalCommits}</td>
                        <td>{totalIssues}</td>
                        <td>{totalTests}</td>
                    </tr>
                    </tbody>
                </Table>
                </div>
            </Container>

            <h1>Data Sources</h1>
            <Stack direction="row" justifyContent="center" flexWrap="wrap">
                {dataSourceInfo.map((api) => {
                return (
                    <Col key={api.Link} as="div">
                    <MatCard className="infoCard" variant="outlined">
                        <CardActionArea
                        className="customAction"
                        href={api.Link}
                        target="_blank"
                        >
                        <CardMedia
                            className="logo"
                            component="img"
                            image={api.Logo}
                        />
                        <CardContent>
                            <Typography variant="body1" color="text.primary">
                            {api.Title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            {api.Desc}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </MatCard>
                    </Col>
                );
                })}
            </Stack>

            <h1>Tools</h1>
            <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap">
                {toolInfo.map((tool) => {
                return (
                    <Col key={tool.Link} as="div">
                    <MatCard className="infoCard" variant="outlined">
                        <CardActionArea className="customAction" href={tool.Link}>
                        <CardMedia
                            className="logo"
                            component="img"
                            image={tool.Logo}
                        />
                        <CardContent>
                            <Typography variant="body1" color="text.primary">
                            {tool.Title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            {tool.Desc}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </MatCard>
                    </Col>
                );
                })}
            </Stack>

            <h1>GitLab Repository and Postman API</h1>
            <Stack direction="row" justifyContent="center" flexWrap="wrap">
                {repoAndAPI.map((tool) => {
                return (
                    <Col key={tool.Link} as="div">
                    <MatCard className="infoCard" variant="outlined">
                        <CardActionArea
                        className="customAction"
                        href={tool.Link}
                        target="_blank"
                        >
                        <CardMedia
                            className="GLPM"
                            component="img"
                            image={tool.Logo}
                        />
                        </CardActionArea>
                    </MatCard>
                    </Col>
                );
                })}
            </Stack>

        </Container>
    );
  }
  
export default About;
  