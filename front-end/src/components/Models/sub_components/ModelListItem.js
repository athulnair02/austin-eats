import React from 'react';
import { Badge } from 'react-bootstrap';
import { BrowserRouter as Router, Navigate, useNavigate, Link } from 'react-router-dom';
import '../Models.css'

function ModelListItem(props) {
    const navigate = useNavigate();
  
    // todo: clean this up, there's probably a better way..
    let button;
    if (props.redirect) {
      button = <Link to={props.link}><button className='modelListButton'></button></Link>
    } else {
      button = <button className='modelListButton' onClick={() => {navigate(`${props.link}`)}}></button>
    }

    // <Badge style={{backgroundColor: '#c990f0', color: 'black'}} bg=''>🐟 Seafood</Badge>{' '}
    return (
      <div className='modelListItem'>
        <div className='modelListImage' style={{backgroundImage: `url(${props.image})`}}></div>
        <div className='modalListBadges'>
          {/* <Badge style={{backgroundColor: '#f58c8c', color: 'black'}} bg=''>🌎 American</Badge>{' '}
          <Badge style={{backgroundColor: '#ffaa2b', color: 'black'}} bg=''> 🔥 Spicy</Badge>{' '}
          <Badge style={{backgroundColor: '#cccccc', color: 'black'}} bg=''> ⌛ Quick</Badge>{' '} */}
        </div>
        <div className='modelListHeader'>{props.name}</div>
        {button}
      </div>
    )
  }

  export default ModelListItem;