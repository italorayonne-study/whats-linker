const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const entryPoints = {
    main: [
        path.resolve(__dirname, '../src', 'main.ts'),
    ],
    background: path.resolve(__dirname, "..", "src", "background.ts"),
}


module.exports = {
    mode: "production",
    entry: entryPoints,
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};