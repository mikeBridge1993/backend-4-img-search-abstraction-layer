const mongoose = require('mongoose');


let Query = mongoose.model('Query', {
    search: {
        type: String,
        trim: true,
    },
    when: {
        type: Date,
        default: Date.now
    },
    searchImage: {
        type: String,
        trim: true,
    }
});

module.exports = {
    Query
};

