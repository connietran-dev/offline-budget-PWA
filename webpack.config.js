console.log("directory" + __dirname + "/public/dist");
const config = {
    entry: "./public/index.js",
    output: {
      path: __dirname + "/public/dist",
      filename: "bundle.js"
    },
    mode: "development"
  };
  
  module.exports = config;