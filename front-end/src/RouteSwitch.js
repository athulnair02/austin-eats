import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import App from './App'
import About from './components/About/About'
import Cultures from './components/Models/Cultures'
import Recipes from './components/Models/Recipes'
import Restaurants from './components/Models/Restaurants'
import Culture from './components/Instances/Culture'
import Recipe from './components/Instances/Recipe'
import Restaurant from './components/Instances/Restaurant'

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
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