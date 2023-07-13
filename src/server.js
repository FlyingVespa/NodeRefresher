import { error, log } from "console";
import fs from "fs";
import http from "http";
import { fileURLToPath } from "url";
import path from "path";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! SERVER ++++++++++++++++++++++++ //
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCT_ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //! OVERVIEW PAGE

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // ! PRODUCT PAGE
  } else if (pathName === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(tempProduct);

    //! API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //! Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "custom-header": "uniqie custom response as meta info",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("SERVER IS RUNNING - listening on 8000");
});
