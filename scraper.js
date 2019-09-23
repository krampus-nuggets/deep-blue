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

  let venueData = await pageViewer.evaluate(
    () => {
      // Array for storing Venue Values
      let venues = [];
      // Define value container within root
      let venueElement = document.querySelectorAll( "div.sr_item" );
      // Exfil required data
      venueElement.forEach(
        (elementValue) => {

          let venueJSON = {};

          try {
            venueJSON.title = elementValue.querySelector("span.sr-hotel__title").innerText;
            venueJSON.score = elementValue.querySelector("div.review-score-badge").innerText;
            venueJSON.reviewCount = elementValue.querySelector("div.bui-review-score__text").innerText;
            venueJSON.address = elementValue.querySelector("a.href").innerText;

            if ( elementValue.querySelector("span.bui-u-sr-only")) {
              venueJSON.price = elementValue.querySelector("span.bui-u-sr-only").innerText;
            }
          }
          catch (exception) {

          }
          venues.push(venueJSON);
        }
      );
      return venues;
    }
  );
  console.dir(venueData)
}
) ();
