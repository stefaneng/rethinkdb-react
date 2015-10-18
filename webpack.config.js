var path = require('path');

module.exports = {
    entry: "./app/client.js",
    output: {
      path: path.resolve(__dirname, 'public/dist'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
