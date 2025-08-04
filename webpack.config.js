const path = require('path');

module.exports = [
    {
        entry: './scripts/loan-details.js',
        output: {
            filename: 'loan-details.js',
            path: path.resolve(__dirname, 'dist'),
        },
        mode: 'production',
    },
    {
        entry: './scripts/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
        },
        mode: 'production',
    },
    {
        entry: './scripts/loans.js',
        output: {
            filename: 'loans.js',
            path: path.resolve(__dirname, 'dist'),
        },
        mode: 'production',
    }
]