
var mongoose = require('mongoose');
var blogVar = mongoose.model('blogs');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.blogList = function(req, res) {
    console.log("Getting the list of blogs");
    blogVar
        .find()
	.exec(function(err, results) {
	    if (!results) {
		sendJSONresponse(res, 404, {
		    "message": "no blogs"
		});
		return;
	    } else if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
	    }
	    console.log(results);
	    sendJSONresponse(res,200, buildBlogList(req, res, results));
	});
};

var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(obj) {
	blogs.push({
	    blogTitle: obj.blogTitle,
	    blogText: obj.blogText,
	    _id: obj._id,
	    userName: obj.userName,
	    userEmail: obj.userEmail
	});
    });
    return blogs
};

module.exports.blogReadOne = function(req, res) {
    console.log('Finding blog', req.params);
    if (req.params && req.params.blogid) {
	blogVar
	    .findById(req.params.blogid)
	    .exec(function(err ,blogs) {
		if (!blogs) {
		    sendJSONresponse(res, 404, {
			"message": "blogsid not found"
		    });
		    return;
		} else if (err) {
		    console.log(err);
		    sendJSONresponse(res, 404, err);
		    return;
		}
		console.log(blogs);
		sendJSONresponse(res, 200, blogs);
	    });
    } else {
	console.log ('No blogsid specified');
	sendJSONresponse(res, 404, {
	    "message": "No blogsid in request"
	});
    }
};
					

module.exports.blogCreate = function(req, res) {
    console.log(req.body);
    blogVar
	.create({
	    blogTitle: req.body.blogTitle,
	    blogText: req.body.blogText,
	    userName: req.body.userName,
	    userEmail: req.body.userEmail
	    //createdOn: req.body.createdOn
	}, function(err, blog) {
	    if (err) {
		console.log(err);
		sendJSONresponse(res, 400, err);
	    } else {
		console.log(blog);
		sendJSONresponse(res, 201, blog);
	    }
	}
      );
};


module.exports.blogUpdateOne = function(req, res) {
    console.log("Updating a blog entry with id of ", req.params.blogid);
    console.log(req.body);
    blogVar
        .findOneAndUpdate(
	    { _id: req.params.blogid },
	    { $set: {"blogTitle": req.body.blogTitle,
	    "blogText": req.body.blogText}},
	    //{ $set: {"createdOn": req.body.createdOn }},
	    function (err, response) {
		if (err) {
		    sendJSONresponse(res, 400, err);
		} else {
		    sendJSONresponse(res, 201, response);
		}
	    }
	);
};

module.exports.blogDeleteOne = function(req, res) {
    console.log("Deleting blog entry with id of ", req.params.id);
    console.log(req.body);
    blogVar
        .findByIdAndRemove(req.params.blogid)
        .exec (
	    function(err, response) {
		if (err) {
		    sendJSONresponse(res, 404, err);
		} else {
		    sendJSONresponse(res, 204, null);
		}
	    }
	);
};
