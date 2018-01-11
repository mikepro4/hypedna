const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					cacheDirectory: true,
					plugins: ["transform-decorators-legacy"],
					presets: ["es2015", "stage-0", "react"]
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader", "sass-loader"]
				})
			},
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.(woff2?|svg)$/, loader: "url-loader?limit=10000" },
			{ test: /\.(ttf|eot)$/, loader: "file-loader" },
			{ test: /\.png$/, loader: "url-loader?mimetype=image/png" }
		]
	}
};
