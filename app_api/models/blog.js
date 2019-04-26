var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    userName: String,
    userEmail: String
    


    
    /*,createdOn: {
	type: Date,
	"default": Date.now
    }*/
});

mongoose.model('blogs', blogSchema);
