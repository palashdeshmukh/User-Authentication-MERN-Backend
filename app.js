const express = require('express');
const cors = require('cors');
const  bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path   = require('path');
const server = express();
const port = 8082;
const loginRoute = require('./routes/Login');
const registerRoute = require('./routes/Register');

server.use(cors());
server.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/LoginID', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

server.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists in the database
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already in use' });
  }

  // If the username is not in use, proceed with registration
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


server.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      // If the user is not found, return an error response
      return res.status(401).json({ error: 'User not found' });
    }

    if (await bcrypt.compare(password, user.password)) {
      // Passwords match, so login is successful
      res.json({ message: 'Login successful' });
    } else {
      // Passwords do not match, return an error response
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



server.listen(port, () => console.log(`Server started at http://localhost:${port}`));

module.exports = server;
