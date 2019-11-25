// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

'use strict';

const puppeteer = require("puppeteer");

// Example Link
// https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaPsBiAEBmAEJuAEXyAEM2AEB6AEB-AELiAIBqAIDuALWgaTsBcACAQ&sid=161aee9a54851cac5480d4abbea3e659&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.en-gb.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaPsBiAEBmAEJuAEXyAEM2AEB6AEB-AELiAIBqAIDuALWgaTsBcACAQ%3Bsid%3D161aee9a54851cac5480d4abbea3e659%3Bsb_price_type%3Dtotal%26%3B&ss=Cape+Town%2C+Western+Cape%2C+South+Africa&is_ski_area=&checkin_monthday=1&checkin_month=10&checkin_year=2019&checkout_monthday=5&checkout_month=10&checkout_year=2019&group_adults=1&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=Cape+Town&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=-1217214&dest_type=city&iata=CPT&place_id_lat=-33.924801&place_id_lon=18.419701&search_pageview_id=c7717aeb94fb0225&search_selected=true&search_pageview_id=c7717aeb94fb0225&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&order=

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
})();
