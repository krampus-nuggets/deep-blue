// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

const puppeteer = require("puppeteer");

let searchURL = "<url>";

(async () => {
  const headless = await puppeteer.launch({ headless: true });
  const pageLauncher = await headless.newPage();
  await pageLauncher.setViewport({ width: 1920, height: 1080 });
  await pageLauncher.goto(searchURL);

  // Main Data Retriever
  let venueData = await pageLauncher.evaluate(() => {
    let venues = [];
    let venueElements = document.querySelectorAll("div.sr_property_block[data-hotelId]");
    venueElements.forEach((venElm) => {
      let venueJSON = {};
      try {
        venueJSON.title = venElm.querySelector("span.sr-hotel__name").innerText;
      }
      catch (exception){

      }
      venues.push(venueJSON);
    });
    return venues;
  });
  console.dir(venueData);
})();
