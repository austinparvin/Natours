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

const server = http.createServer((req, res) => {
    res.end("Hello from the server");
});

server.listen(8000, "127.0.0.1", () => {
    console.log("[Asimo] Server has started!");
});
