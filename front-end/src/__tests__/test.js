import React from "react"
import { render, screen } from "@testing-library/react"
import MainNavbar from "../components/Webpage/Navbar"
import About from "../components/About/About"
import Cultures from "../components/Models/Cultures"
import Recipes from "../components/Models/Recipes"
// import Restaurants from "../components/Models/Restaurants"

test("Render about page", () => {
  render(<About/>);
  const titleElem = screen.getByText("Team Members");
  expect(titleElem).toBeInTheDocument();
})

test("Render Cultures page", () => {
  render(<Cultures/>);
  const titleElem = screen.getByText("Cultures");
  expect(titleElem).toBeInTheDocument();
})
  
test("Render Recipes page", () => {
  render(<Recipes/>);
  const titleElem = screen.getByText("Recipes");
  expect(titleElem).toBeInTheDocument();
})

// test("Render Restaurants page", () => {
//   render(<Restaurants/>);
//   const titleElem = screen.getByText("Restaurants");
//   expect(titleElem).toBeInTheDocument();
// })

test("Render navbar", () => {
  render(<MainNavbar/>);
  const titleElem = screen.getByText("Search");
  expect(titleElem).toBeInTheDocument();
})