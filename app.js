const Crawler = require("crawler");

const URL =
  "https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l2632&_nkw=graphics+card&_sacat=175673";
console.log("URL", URL);

let obsoleteUris = []; // Array of what was already crawled
let crawler = new Crawler();
let results = [];

const crawlAllUrls = (url) => {
  console.log(`Crawling ${url}`);
  crawler.queue({
    uri: url,
    callback: (err, res, done) => {
      if (err) {
        throw err;
      }
      let $ = res.$;
      try {
        let urls = $("a");
        let items = $(".s-item");
        items.map((item) => {
          console.log("item in for each loop", item);
          // let detailedItem = {
          //   price: "",
          //   url: item.children[0].children[0].children[1].attribs.href,
          //   title: "",
          // };
          // console.log(
          //   "item.children[0].children[0].children[1].attribs.href",
          //   item.children[0].children[0].children[1].attribs.href
          // );
        });
        // results.push(items);
        console.log("items", items);
        console.log(
          "items[0].children",
          items[0].children[0].children[0].children
        );
        Object.keys(urls).forEach((item) => {
          if (urls[item].type === "tag") {
            results.push(item);
            let href = urls[item].attribs.href;
            if (href && !obsoleteUris.includes(href) && href.startsWith(url)) {
              href = href.trim();
              obsoleteUris.push(href);
              // Slow down the loop
              setTimeout(() => {
                href.startsWith("http")
                  ? crawlAllUrls(href)
                  : crawlAllUrls(`${url}${href}`); // The latter might need extra code to test if its the same site and it is a full domain with no URI
              }, 5000);
            }
          }
        });
      } catch (e) {
        console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
        done();
      }
      done();
    },
  });
};

crawlAllUrls(URL);
// setTimeout(() => {
//   console.log(results[40]);
// }, 10000);
