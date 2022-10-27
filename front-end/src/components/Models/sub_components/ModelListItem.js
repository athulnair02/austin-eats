import React from 'react';
import { Badge } from 'react-bootstrap';
import { BrowserRouter as Router, Navigate, useNavigate, Link } from 'react-router-dom';
import '../../../styles/Models.css'
import '../../../styles/Instances.css'
import { display } from '@mui/system';

function ModelListItem(props) {
    const navigate = useNavigate();
  
    const button = <button className='modelListButton' onClick={() => {navigate(`${props.link}`)}}></button>
    /*if (props.redirect) {
      button = <Link to={props.link}><button className='modelListButton'></button></Link>
    } else {
      button = <button className='modelListButton' onClick={() => {navigate(`${props.link}`)}}></button>
    }*/

    let attributeElements = []
    if (props.attributes) {
      attributeElements = props.attributes.map((attributeText) => 
        <li style={{fontSize: '20px', display: 'block', width: '100%'}}>{attributeText}</li>
      )
    }

    let badges = []
    if (props.badges) {
      for (const [badgeText, style] of Object.entries(props.badges)) {
        let newStyle = Object.assign({}, style);
        newStyle.color = 'black'
        newStyle.margin = '.15em'
        newStyle.fontSize = '13px'

        badges.push(
          <Badge style={newStyle} bg=''>{badgeText}</Badge>
        )
      }
    }

    return (
      <div className='modelListItem' style={props.style}>
        <div className='modelListImageWrapper'>
          <div className='modelListImage' style={{backgroundImage: `url(${props.image})`}}></div>
          <div className='shadowOverlay'></div>
        </div>
        <div className='modalListBadges'>
          {badges}
        </div>
        <div className='modelListHeader'>{props.name}</div>
        <ul className='horizontalBulletList' style={{textAlign: 'left', paddingRight: '25px', marginLeft: 0, lineHeight: 1.25}}>
          {attributeElements}
        </ul>
        {button}
      </div>
    )
  }

  export default ModelListItem;