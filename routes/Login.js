const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
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
  



module.exports= router;