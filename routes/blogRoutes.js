const express = require('express');
const auth = require('../middleware/auth');
const {
  createBlog,
  getPublishedBlogs,
  getBlogById,
  getMyBlogs,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

const router = express.Router();

router.get('/', getPublishedBlogs);
router.get('/:id', getBlogById);
router.get('/me/blogs', auth, getMyBlogs);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;
