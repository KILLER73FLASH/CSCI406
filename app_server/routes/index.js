var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog.js');
var editBlog = require('../controllers/blog.js');
var deleteBlog = require('../controllers/blog.js');

/* Setup routes to pages. */
router.get('/', ctrlHome.home);
router.get('/list',ctrlBlog.list);
router.get('/add',ctrlBlog.add);
router.post('/add', ctrlBlog.addBlog);
router.get('/edit/:blogid',editBlog.edit);
router.post('/edit/:blogid', editBlog.editBlog);
router.get('/remove/:blogid', deleteBlog.remove);
router.post('/remove/:blogid', deleteBlog.removeBlog);

module.exports = router;
