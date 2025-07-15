const path = require('path');

module.exports = {
    entry: './scripts/loan-details',
    output: {
        filename: 'loan-details.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
}