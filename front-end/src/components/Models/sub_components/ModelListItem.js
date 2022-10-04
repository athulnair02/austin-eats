import React from 'react';
import { Badge } from 'react-bootstrap';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import '../Models.css'

function ModelListItem(props) {
    const navigate = useNavigate();
  
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
        <button className='modelListButton' onClick={() => {navigate(`${props.link}`)}}></button>
      </div>
    )
  }

  export default ModelListItem;