import React from 'react';
import { Get_User_Coordinates } from '../../SharedFunctions';
import { Get_Data } from '../../SharedFunctions';
import L from 'leaflet';
import '../../styles/Home.css'
import '../../styles/Models.css'

function Home() {
    const map = React.useRef();
    React.useEffect(() => {
        if (map.current != null) return;
        map.current = L.map('map').setView([30.266666, -97.733330], 12.5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.current);

        Get_Data('restaurants').then(data => {
            for (const restaurant of data.relations) {
                let openText = restaurant.open_now ? 'Open' : 'Closed';
                let info = `<b>${restaurant.name}</b><br>${openText} | ${restaurant.rating} stars`;
                if (restaurant.price) info += ` | ${restaurant.price}`;

                var link = info + '<br><br><a href=' + `/restaurants/${restaurant.id}` + '>View restaurant</a>';

                L.marker(restaurant.latlng, {riseOnHover: true}).addTo(map.current)
                    .bindPopup(link) // `<b>${restaurant.name}</b><br>${openText}<br>`
                    .bindTooltip(restaurant.name);
            }
        });

        Get_User_Coordinates().then(coords => {
            L.marker([coords.latitude, coords.longitude], {riseOnHover: true}).addTo(map.current)
                .bindPopup('<b>You are here</b><br>')
                .bindTooltip('Your location')
                .openPopup();
        });
    }, []);

    return(
        <>
            <div className='imageWrapper'>
                <div className='homeImage'></div>
                <div className='homeTitle'> AustinEats </div>
                <div className='shadowOverlay' style={{boxShadow: '0px -20px 20px 0px rgba(203,212,194,1) inset'}}></div>
            </div>
            <div className='homeSubTitle'>
                Supporting local Austin businesses, one at a time.
            </div>
            <div className='homeSubSubTitle'>
                Explore your favorite recipes, from all over the world, from your favorite restaurants.
            </div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
                integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
                crossOrigin=""/>
            <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
                integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
                crossOrigin=""></script>
            <div id='map'/>
        </>
    )
}

export default Home;