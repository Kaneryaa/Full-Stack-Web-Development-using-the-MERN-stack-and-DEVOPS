const { Router } = require('express');
const router = Router();
const { check, validationResult } = require("express-validator");

// Basic route handler for '/'
router.get('/', (req, res) => {
  res.send('User router');
});

// Route handler for adding a user with validation
router.post('/', [
  check("name", "Name is required").not().isEmpty(),
  Check("email", "please enter a valid email").isEmail(),
  check(
    "password",
     "please password shoul have at least 5 character"
  ).isLength({min: 5})
  // Add more validation checks as needed for other fields
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // If validation passes, process the user addition logic here
  const { name } = req.body;
  // Add the user, perform necessary operations
  
  res.send('User added successfully');
});

module.exports = router;
