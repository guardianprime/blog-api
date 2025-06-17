const Blog = require('../models/Blog');
const readingTime = require('../utils/readingTime');

exports.createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  try {
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user.id,
      reading_time: readingTime(body)
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  const { page = 1, limit = 20, author, title, tags, order_by, order = 'desc' } = req.query;
  const filter = { state: 'published' };
  if (author) filter.author = author;
  if (title) filter.title = new RegExp(title, 'i');
  if (tags) filter.tags = { $in: tags.split(',') };

  const sort = {};
  if (order_by) sort[order_by] = order === 'asc' ? 1 : -1;

  const blogs = await Blog.find(filter)
    .populate('author', 'first_name last_name email')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(blogs);
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!blog || blog.state !== 'published') return res.status(404).json({ message: 'Blog not found' });
    blog.read_count += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
};

exports.getMyBlogs = async (req, res) => {
  const { page = 1, limit = 20, state } = req.query;
  const filter = { author: req.user.id };
  if (state) filter.state = state;
  const blogs = await Blog.find(filter).skip((page - 1) * limit).limit(parseInt(limit));
  res.json(blogs);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  const { title, description, tags, body, state } = req.body;
  if (title) blog.title = title;
  if (description) blog.description = description;
  if (tags) blog.tags = tags;
  if (body) {
    blog.body = body;
    blog.reading_time = readingTime(body);
  }
  if (state) blog.state = state;
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
};
