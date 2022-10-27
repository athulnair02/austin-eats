import React from 'react';
import { Images, Container, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../../styles/PageNotFound.css'

function About() {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        navigate('');
    }

    return (
        <>
            <div className='leftRightContainer'>
                <div className='title'>
                    404
                </div>
                <div className='title' style={{fontSize:`55px`}}>
                    Page Not Found
                </div>
            </div>
            <div className='text'>
                Unfortunately, the page you've requested cannot be found.
            </div>
            <div className='text' style={{marginBottom:`10px`}}>
                (Unless you were looking for a page with Larry the fish, then you've found it.)
            </div>
            <img className='center' src="https://media.tenor.com/lhOQ3R_Ru0IAAAAd/fish-slap-slap.gif" style={{marginBottom:`20px`}} />
            <button type="button" onClick={routeChange} className="btn btn-danger btn-lg center" data-toggle="button" aria-pressed="false"
            style={{width:`auto`}}>
                Return Home
            </button>
        </>
    );
  }
  
  export default About;