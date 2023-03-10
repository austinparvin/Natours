const fs = require("fs");

// Blocking Synchronous way
const textIn = fs.readFileSync(__dirname + "/txt/input.txt", "utf8");
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync(__dirname + "/txt/input.txt", textOut);
console.log("Text written!");

// Non-blocking asynchronous way

// Callback hell!
fs.readFile(__dirname + "/txt/start.txt", "utf8", (err, data1) => {
    fs.readFile(__dirname + `/txt/${data1}.txt`, "utf8", (err, data2) => {
        console.log("[Asimo] data2:", data2);
        fs.readFile(__dirname + `/txt/append.txt`, "utf8", (err, data3) => {
            console.log("[Asimo] data3:", data3);
            fs.writeFile(
                __dirname + "/txt/final.txt",
                `${data2}\n${data3}`,
                "utf-8",
                (err) => {
                    console.log("[Asimo] File has been written!");
                }
            );
        });
    });
});
console.log("[Asimo] Non-blocking asynchronous way");
