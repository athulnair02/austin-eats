// Structure of this code was sourced from TA Canyon Mooney

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainNavbar from './components/Webpage/Navbar'

// Import pages
import Home from './components/Home/Home'
import About from './components/About/About'
import Cultures from './components/Models/Cultures'
import Recipes from './components/Models/Recipes'
import Restaurants from './components/Models/Restaurants'
import Culture from './components/Instances/Culture'
import Recipe from './components/Instances/Recipe'
import Restaurant from './components/Instances/Restaurant'
import PageNotFound from './components/Webpage/PageNotFound'
import Search from './components/Search/Search'
import Visualizations from './components/Visualizations/Visualizations';
import ProviderVisualizations from './components/ProviderVisualizations/ProviderVisualizations';

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
                <Route path="/restaurants/:id" element={<Restaurant />} />
                <Route path="/recipes/:id" element={<Recipe />} />
                <Route path="/cultures/:id" element={<Culture />} />
                <Route path="/visualizations" element={<Visualizations/>} />
                <Route path="/provider" element={<ProviderVisualizations/>} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouteSwitch;