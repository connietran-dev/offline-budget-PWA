const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "production",
  entry: {
    index: "./public/index.js"
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js"
  },
  plugins: [
    new WebpackPwaManifest({
      // the name of the generated manifest file
      filename: "manifest.json",
      // we aren't using webpack to generate our html so we
      // set inject to false
      inject: false,
      // set fingerprints to `false` to make the names of the generated
      // files predictable making it easier to refer to them in our code
      fingerprints: false,
      name: "IndexBudget Tracker PWA",
      short_name: "Index Budget",
      theme_color: "#e6f542",
      background_color: "#e6f542",
      start_url: "/",
      display: "fullscreen",
      orientation: "landscape",
      icons: [
        {
          src: path.resolve(
            __dirname,
            "public/icons/icon-512x512.png"
          ),
          // the plugin will generate an image for each size
          // included in the size array
          size: [72, 96, 128, 144, 152, 192, 384, 512]
        }
      ]
    })
  ],
  // For files ending with .js, we will use babel-loader with preset-env
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './public',
    publicPath: '/dist'
 }
};

module.exports = config;
