var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

router.get('/blog', ctrlBlog.blogList);
router.post('/blog', ctrlBlog.blogCreate);;
router.get('/blog/:blogid', ctrlBlog.blogReadOne);
router.put('/blog/:blogid', ctrlBlog.blogUpdateOne);
router.delete('/blog/:blogid', ctrlBlog.blogDeleteOne);

module.exports = router;
