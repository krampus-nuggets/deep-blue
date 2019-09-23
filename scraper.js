// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

import puppeteer from "puppeteer";

let searchURL = "<url-here>";

( async() => {
  // Define headless browser
  const headless = await puppeteer.launch({ headless: true }); // Set headless browser true | false
  const pageViewer = await browser.newPage();
  await pageViewer.setViewport({ width: 1366, height: 768 }); // Define viewing device size
  await pageViewer.goto(searchURL); // Define URL for puppeteer to digest

