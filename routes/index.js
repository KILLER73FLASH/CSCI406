var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/blogList', ctrlBlog.blogList);
router.get('/blogAdd', ctrlBlog.blogAdd);

module.exports = router;
