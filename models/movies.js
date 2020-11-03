const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   	],

	imdbID: String
});

let Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;