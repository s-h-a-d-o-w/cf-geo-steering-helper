const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const cities = require("./cityIds");

const request = `https://wondernetwork.com/ping-data?sources=${cities.join(
  ","
)}&destinations=${cities.join(",")}`;

fetch(request).then(async response => {
  const result = await response.json();
  fs.writeFileSync(
    path.join(__dirname, "pingDump.json"),
    JSON.stringify(result, null, 2)
  );
});
