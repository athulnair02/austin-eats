import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainNavbar from './components/Webpage/Navbar'

// Import pages
import Home from './components/Home/Home'
import About from './components/Webpage/About'
import Cultures from './components/Models/Cultures'
import Recipes from './components/Models/Recipes'
import Restaurants from './components/Models/Restaurants'
import Culture from './components/Instances/Culture'
import Recipe from './components/Instances/Recipe'
import Restaurant from './components/Instances/Restaurant'

function RouteSwitch() {
    return (
        <BrowserRouter>
            <MainNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/cultures" element={<Cultures />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/culture/:id" element={<Culture />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouteSwitch;