const express = require('express');

const router = express.Router();

router.post('/register', async (req, res) => {
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

 module.exports = router;