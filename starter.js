require('babel-register')({
    presets: ['react', 'env']
})

// Import the rest of our application.
module.exports = require('./server/bin/www');