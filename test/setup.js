const mongoose = require("mongoose");
const User = require("../models/User");
const Blog = require("../models/Blog");
require("dotenv").config();

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
