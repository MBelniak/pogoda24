module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: __dirname + '/js',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/,
            },
        ]
    }
}