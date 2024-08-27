//handle the MongoDB connection using Mongoose.

const mongoose = require ('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/socialnetworkDB',{
    userNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;