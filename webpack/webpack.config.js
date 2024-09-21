const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const entryPoints = {
    main: [
        path.resolve(__dirname, '..', 'src', 'main.ts'),
        path.resolve(__dirname, '..', 'src', 'main.css')
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
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', // Injeta CSS no DOM via <style>
                    'css-loader',   // Interpreta @import e url() como require/import
                ],
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};