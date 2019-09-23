// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

const puppeteer = require('puppeteer');;

let searchURL = "<url-here>";

( async() => {
  // Define headless browser
  const headless = await puppeteer.launch({ headless: false }); // Set headless browser true | false
  const pageViewer = await headless.newPage();
  await pageViewer.setViewport({ width: 1366, height: 768 }); // Define viewing device size
  await pageViewer.goto(searchURL); // Define URL for puppeteer to digest

