const { Router } = require('express');
const router = Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt")

// Basic route handler for '/'
router.get('/', (req, res) => {
  res.send('User router');
});

// Route handler for adding a user with validation
router.post('/', [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  // Add more validation checks as needed...
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

   
    
    const { name, email, password } = req.body;

    // Check if user with the provided email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // Create a new User instance
    const newUser = new User({ name, email, password });
    
     const salt = await bcrypt.genSalt(10);
     newUser.password = await bcrypt.hash(password, salt)
    // Save the new user to the database
    await newUser.save();
    console.log(req.body)
    res.status(201).json({ msg: "User created successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
