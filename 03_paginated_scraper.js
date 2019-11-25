// Deep Blue Scraper - krampus-nuggets
// https://github.com/krampus-nuggets

'use strict';

const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

// Assign URL to let variable
let searchURL = "https://www.booking.com/searchresults.en-gb.html?aid=898409&label=affnetawin-bannerindex-us-index-1_pub-214459_site-http%3A%2F%2Fwww.joinhoney.com%2Fpartners_pname-Honey+Science+Corporation_clkid-6776_1548967273_0167715758587e587a3fe34e1c85ae14&sid=02d5746ca6168ef577ac24c6e9dbbded&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.en-gb.html%3Faid%3D898409%3Blabel%3Daffnetawin-bannerindex-us-index-1_pub-214459_site-http%253A%252F%252Fwww.joinhoney.com%252Fpartners_pname-Honey%2520Science%2520Corporation_clkid-6776_1548967273_0167715758587e587a3fe34e1c85ae14%3Bsid%3D02d5746ca6168ef577ac24c6e9dbbded%3Bsb_price_type%3Dtotal%3Bsrpvid%3D2a2689b38167030c%26%3B&ss=Western+Cape%2C+South+Africa&is_ski_area=&ssne=Gordon%CA%BCs+Bay&ssne_untouched=Gordon%CA%BCs+Bay&checkin_year=2020&checkin_month=4&checkin_monthday=24&checkout_year=2020&checkout_month=4&checkout_monthday=26&group_adults=8&group_children=0&no_rooms=4&b_h4u_keep_filters=&from_sf=1&search_pageview_id=95ff89c5b1e2009a&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&ac_position=1&ac_langcode=en&ac_click_type=b&dest_id=1169&dest_type=region&place_id_lat=-33.909723&place_id_lon=19.652489&search_pageview_id=95ff89c5b1e2009a&search_selected=true&region_type=province&ss_raw=Western+Cape";

async function paginated_scraper() {
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

  // START - 



  // END

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

paginated_scraper();
