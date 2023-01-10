#!/usr/bin/env node

const http = require("http");
const yargs = require("yargs");

// Parse command line arguments
const argv = yargs
  .option("hostname", {
    alias: "h",
    describe: "The hostname of the HTTP server",
    type: "string",
    demandOption: true,
  })
  .option("port", {
    alias: "p",
    describe: "The port of the HTTP server",
    type: "number",
    default: "80",
  })
  .option("path", {
    alias: "P",
    describe: "The path to send the request to",
    type: "string",
    default: "/",
  })
  .option("timeout", {
    alias: "t",
    describe: "The timeout for the HTTP request, in milliseconds",
    type: "number",
    default: 2000,
  })
  .option("headers", {
    alias: "H",
    describe:
      'HTTP headers to send with the request, in the format "key: value"',
    type: "array",
  }).argv;

const hostname = argv.hostname;
const port = argv.port;
const path = argv.path;
const timeout = argv.timeout;
const headers = argv.headers;

// Set up options for the HTTP request
const options = {
  hostname: hostname,
  port: port,
  path: path,
  method: "GET",
  timeout: timeout,
};

// Add HTTP headers to the request if they were specified
if (headers) {
  options.headers = {};
  headers.forEach((header) => {
    const keyValue = header.split(":");
    options.headers[keyValue[0].trim()] = keyValue[1].trim();
  });
}

// Send the HTTP request
const req = http.request(options, (res) => {
  console.log(`HTTP server at ${hostname}:${port}${path} is up`);
  console.log(`Status code: ${res.statusCode}`);
});

// Handle error events
req.on("error", (error) => {
  console.error(`HTTP server at ${hostname}:${port}${path} is down`);
  //   console.error(error);
});

// Handle timeout
req.on("timeout", () => {
  console.error(
    `HTTP request to ${hostname}:${port}${path} timed out after ${timeout} milliseconds`
  );
});

req.end();
