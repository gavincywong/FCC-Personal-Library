let mongoose = require('mongoose')
let mongodb = require('mongodb')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

let librarySchema = new mongoose.Schema({
	title: {type: String, required: true},
	comments: [String]
}, {versionKey: false})

module.exports = Library = mongoose.model("Library", librarySchema)
