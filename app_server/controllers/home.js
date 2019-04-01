/* GET home page. */
module.exports.home = function(req, res) {
    res.render('home', {title: 'Welcome to my blog site'});
};
