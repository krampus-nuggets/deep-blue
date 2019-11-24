// Deep Blue - Pagination Count Finder

"use strict";

const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

let searchURL = "https://www.booking.com/searchresults.en-gb.html?aid=898409&label=affnetawin-bannerindex-us-index-1_pub-214459_site-http%3A%2F%2Fwww.joinhoney.com%2Fpartners_pname-Honey+Science+Corporation_clkid-6776_1548967273_0167715758587e587a3fe34e1c85ae14&sid=02d5746ca6168ef577ac24c6e9dbbded&sb=1&src=searchresults&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.en-gb.html%3Faid%3D898409%3Blabel%3Daffnetawin-bannerindex-us-index-1_pub-214459_site-http%253A%252F%252Fwww.joinhoney.com%252Fpartners_pname-Honey%2520Science%2520Corporation_clkid-6776_1548967273_0167715758587e587a3fe34e1c85ae14%3Bsid%3D02d5746ca6168ef577ac24c6e9dbbded%3Btmpl%3Dsearchresults%3Bac_click_type%3Db%3Bac_position%3D0%3Bcheckin_month%3D2%3Bcheckin_monthday%3D1%3Bcheckin_year%3D2020%3Bcheckout_month%3D2%3Bcheckout_monthday%3D8%3Bcheckout_year%3D2020%3Bclass_interval%3D1%3Bdest_id%3D-1232164%3Bdest_type%3Dcity%3Bdtdisc%3D0%3Bfrom_sf%3D1%3Bgroup_adults%3D8%3Bgroup_children%3D0%3Binac%3D0%3Bindex_postcard%3D0%3Blabel_click%3Dundef%3Bno_rooms%3D4%3Boffset%3D0%3Bpostcard%3D0%3Braw_dest_type%3Dcity%3Broom1%3DA%252CA%3Broom2%3DA%252CA%3Broom3%3DA%252CA%3Broom4%3DA%252CA%3Bsb_price_type%3Dtotal%3Bsearch_selected%3D1%3Bshw_aparth%3D1%3Bslp_r_match%3D0%3Bsrc%3Dindex%3Bsrc_elem%3Dsb%3Bsrpvid%3D668c3d26573c00d3%3Bss%3DGordon%253Fs%2520Bay%252C%2520Western%2520Cape%252C%2520South%2520Africa%3Bss_all%3D0%3Bss_raw%3DGordon%2527s%2520Ba%3Bssb%3Dempty%3Bsshis%3D0%3Btop_ufis%3D1%26%3B&ss=Western+Cape%2C+South+Africa&is_ski_area=&ssne=Gordon%CA%BCs+Bay&ssne_untouched=Gordon%CA%BCs+Bay&city=-1232164&checkin_year=2020&checkin_month=2&checkin_monthday=1&checkout_year=2020&checkout_month=2&checkout_monthday=8&group_adults=8&group_children=0&no_rooms=4&from_sf=1&ss_raw=Western+Cape&ac_position=1&ac_langcode=en&ac_click_type=b&dest_id=1169&dest_type=region&place_id_lat=-33.909723&place_id_lon=19.652489&search_pageview_id=668c3d26573c00d3&search_selected=true&region_type=province&search_pageview_id=668c3d26573c00d3&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0";

async function paginationFinder() {
    var timeStart = performance.now();

    const headless = await puppeteer.launch({ headless: true });
    const tabLauncher = await headless.newPage();
    
    await tabLauncher.setViewport({ width: 1366, height: 768 });
    await tabLauncher.goto(searchURL);

    let pagData = await tabLauncher.evaluate(() => {
        let values = [];
        let valueElements = document.querySelectorAll("div.bui-pagination > nav > ul > li > ul > li");

        valueElements.forEach((venElm) => {
            let pagValues = {};

            try {
                pagValues.number = venElm.querySelector("div.bui-pagination > nav > ul > li > ul > li > a > div.bui-u-inline").innerText;
            }
            catch(e) {
                console.log(e)
            }
            values.push(pagValues);
        });
        return values;
    });
    console.dir(pagData);
    await headless.close();

    var timeStop = performance.now();
    console.log("Pagination Finder Timing = " + (timeStop - timeStart));
}

paginationFinder();
