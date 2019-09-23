// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

const puppeteer = require("puppeteer");

// Assign URL to let variable
let searchURL = "<url>";

(async () => {
  // Chromium Headless - true | false browser window
  const headless = await puppeteer.launch({ headless: true });
  // Launch scraper on New Page
  const pageLauncher = await headless.newPage();
  // Set "monitor" size for pageLauncher
  await pageLauncher.setViewport({ width: 1920, height: 1080 });
  // Launch page from variable holding URL
  await pageLauncher.goto(searchURL);

  // Main Data Retriever
  let venueData = await pageLauncher.evaluate(() => {
    // Array to store values
    let venues = [];
    // Root block with IDs
    let venueElements = document.querySelectorAll("div.sr_property_block[data-hotelId]");
    // Main function for processing elements/tags
    venueElements.forEach((venElm) => {
      let venueJSON = {};
      try {
        // Scrape for Title
        venueJSON.title = venElm.querySelector("span.sr-hotel__name").innerText;
        venueJSON.score = venElm.querySelector("div.bui-review-score__badge").innerText;
        venueJSON.reviewCount = venElm.querySelector("div.bui-review-score__text").innerText;
        venueJSON.address = venElm.querySelector("div.sr_card_address_line").innerText;
      }
      catch (exception){

      }
      venues.push(venueJSON);
    });
    // Print out values/array
    return venues;
  });
  // Print all object props
  console.dir(venueData);
  // Kill process when done
  await headless.close()
})();
