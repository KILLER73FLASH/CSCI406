/* GET blog list page. */
module.exports.blogList = function(req, res) {
    res.render('blogList', {title: 'List blogs'});
};

/* GET blog add page. */
module.exports.blogAdd = function(req, res) {
    res.render('blogAdd', {title: 'Add blog'});
};
