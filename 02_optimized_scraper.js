// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

'use strict';

const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

// Assign URL to let variable
let searchURL = "https://www.booking.com/searchresults.en-gb.html?label=affnetawin-bannerindex-us-index-1_pub-214459_site-http://www.joinhoney.com/partners_pname-Honey%20Science%20Corporation_clkid-6776_1548967273_0167715758587e587a3fe34e1c85ae14&sid=02d5746ca6168ef577ac24c6e9dbbded&sb=1&src=index&src_elem=sb&error_url=https://www.booking.com/index.en-gb.html?label=gen173nr-1DCAEoggI46AdIM1gEaPsBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALX4eXuBcACAQ;sid=02d5746ca6168ef577ac24c6e9dbbded;sb_price_type=total&;&ss=Gordon?s%20Bay,%20Western%20Cape,%20South%20Africa&is_ski_area=&checkin_year=2020&checkin_month=2&checkin_monthday=1&checkout_year=2020&checkout_month=2&checkout_monthday=8&group_adults=8&group_children=0&no_rooms=4&b_h4u_keep_filters=&from_sf=1&ss_raw=Gordon%27s%20Ba&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=-1232164&dest_type=city&place_id_lat=-34.156559&place_id_lon=18.871231&search_pageview_id=ec7c7d366cea00e2&search_selected=true&search_pageview_id=ec7c7d366cea00e2&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&aid=898409&aid=898409&label=affnetawin-index_pub-214459_site-g8255060261926650537-a8255079866302981521_pname-Honey+Science+Corporation_plc-_ts-_clkid-6776_1574531530_367aaa8c911c0ffce6ef8d29c204029d&awc=6776_1574531530_367aaa8c911c0ffce6ef8d29c204029d&utm_source=affnetawin&utm_medium=&utm_term=index&utm_content=214459";

async function opt_scraper() {
  var timeStart = performance.now();

  const headless = await puppeteer.launch({ headless: true });
  const tabLauncher = await headless.newPage();  

  // START - Remove images from scraping process

  await tabLauncher.setRequestInterception(true);

  tabLauncher.on("request", (request) => {
    if(["stylesheet", "images", "script"].indexOf(request.resourceType()) !== -1) {
      request.abort();
    }
    else {
      request.continue();
    }
  })

  // END

  await tabLauncher.setViewport({ width: 1366, height: 768 });
  await tabLauncher.goto(searchURL);

  let venueData = await tabLauncher.evaluate(() => {
    let venues = [];
    let venueElements = document.querySelectorAll("div.sr_property_block[data-hotelId]");
    venueElements.forEach((venElm) => {
      let venueJSON = {};
      // TRY CATCH
      try {
        venueJSON.title = venElm.querySelector("span.sr-hotel__name").innerText.trim();
        venueJSON.score = venElm.querySelector("div.bui-review-score__badge").innerText;
        venueJSON.reviewCount = venElm.querySelector("div.bui-review-score__text").innerText;
        venueJSON.address = venElm.querySelector("a.bui-link").innerText.replace("  Show on map ", "").trim();
        // IF ELSE
        if (venElm.querySelector("div.bui-price-display__value")) {
          venueJSON.price = venElm.querySelector("div.bui-price-display__value").innerText;
        }
        else {
          venueJSON.price = "No Price"
        }        
      }
      catch(exception) {

      }
      venues.push(venueJSON);
    });
    return venues;
  });
  console.dir(venueData);
  await headless.close();

  var timeStop = performance.now();
  console.log("Function Timing = " + (timeStop - timeStart));
}

async function og_scraper() {
  var timeStart = performance.now();

  // Chromium Headless - true | false browser window
  const headless = await puppeteer.launch({ headless: true });
  // Launch scraper on New Page
  const pageLauncher = await headless.newPage();
  // Set "monitor" size for pageLauncher
  await pageLauncher.setViewport({ width: 1366, height: 768 });
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
        venueJSON.title = venElm.querySelector("span.sr-hotel__name").innerText.trim();
        venueJSON.score = venElm.querySelector("div.bui-review-score__badge").innerText;
        venueJSON.reviewCount = venElm.querySelector("div.bui-review-score__text").innerText;
        venueJSON.address = venElm.querySelector("a.bui-link").innerText.replace("  Show on map ", "").trim();
        if (venElm.querySelector("div.bui-price-display__value")) {
          venueJSON.price = venElm.querySelector("div.bui-price-display__value").innerText;
        }
        else {
          venueJSON.price = "No Price"
        }
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

  var timeStop = performance.now();
  console.log("OG Time = " + (timeStop - timeStart));
}

async function compareScrapers() {
  try {
    await og_scraper();
    await opt_scraper();
  }
  catch(e) {
    console.log(e);
  }
}

compareScrapers();
