var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var ctrlBlog = require('../controllers/blog');
var ctrlAuthen = require('../controllers/authentication');

//var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

// BLOG
router.get('/blog', ctrlBlog.blogList);
router.post('/blog', auth, ctrlBlog.blogCreate);;
router.get('/blog/:blogid', ctrlBlog.blogReadOne);
router.put('/blog/:blogid', ctrlBlog.blogUpdateOne);
router.delete('/blog/:blogid', auth, ctrlBlog.blogDeleteOne);

// COMMENT
router.put('/blog/:blogid', ctrlBlog.addComment);
router.put('/blog/:blogid', ctrlBlog.editComment);
router.put('/blog/:blogid', ctrlBlog.removeComment);

// AUTHENTICATION
router.post('/register', ctrlAuthen.register);
router.post('/login', ctrlAuthen.login);

module.exports = router;
