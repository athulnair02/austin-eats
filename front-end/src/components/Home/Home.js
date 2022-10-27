import React from 'react';
import '../../styles/Home.css'
import '../../styles/Models.css'

function Home() {
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
        </>
    )
}

export default Home;