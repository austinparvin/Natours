const fs = require("fs");
const http = require("http");
const url = require("url");

/*********************************************     FILES     *********************************************/

// // Blocking Synchronous way
// const textIn = fs.readFileSync(__dirname + "/txt/input.txt", "utf8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync(__dirname + "/txt/input.txt", textOut);
// console.log("Text written!");

// // Non-blocking asynchronous way

// // Callback hell!
// fs.readFile(__dirname + "/txt/start.txt", "utf8", (err, data1) => {
//     if (err) return console.log("ERROR!");
//     fs.readFile(__dirname + `/txt/${data1}.txt`, "utf8", (err, data2) => {
//         console.log("[Asimo] data2:", data2);
//         fs.readFile(__dirname + `/txt/append.txt`, "utf8", (err, data3) => {
//             console.log("[Asimo] data3:", data3);
//             fs.writeFile(
//                 __dirname + "/txt/final.txt",
//                 `${data2}\n${data3}`,
//                 "utf-8",
//                 (err) => {
//                     console.log("[Asimo] File has been written!");
//                 }
//             );
//         });
//     });
// });
// console.log("[Asimo] Non-blocking asynchronous way");

/*********************************************     SERVER   *********************************************/

const replaceTemplate = (temp, product) => {
    let output = temp
        .replace(/{%PRODUCT_NAME%}/g, product.productName)
        .replace(/{%IMAGE%}/g, product.image)
        .replace(/{%PRICE%}/g, product.price)
        .replace(/{%FROM%}/g, product.from)
        .replace(/{%NUTRIENTS%}/g, product.nutrients)
        .replace(/{%QUANTITY%}/g, product.quantity)
        .replace(/{%DESCRIPTION%}/g, product.description)
        .replace(/{%ID%}/g, product.id);

    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    else output = output.replace(/{%NOT_ORGANIC%}/g, "organic");

    return output;
};
const templateOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
);
const templateProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
);
const templateCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
);

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(productData);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === "/" || pathname === "/overview") {
        const cardsHtml = dataObj.map((el) => {
            return replaceTemplate(templateCard, el);
        });
        const overviewHtml = templateOverview.replace(
            /{%PRODUCT_CARDS%}/g,
            cardsHtml
        );
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(overviewHtml);

        // Product page
    } else if (pathname === "/product") {
        const product = dataObj[query.id];
        const productHtml = replaceTemplate(templateProduct, product);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(productHtml);

        // API page
    } else if (pathname === "/api") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(productData);

        // 404 page
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html",
        });
        res.end("<h1>Page not found!<h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("[Asimo] Server has started!");
});
