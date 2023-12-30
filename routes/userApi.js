// const { Router } = require('express');
// const router = Router();
// const { check, validationResult } = require("express-validator");
// const User = require("../models/User");
// const bcrypt = require("bcrypt")
// const jwt =  require ('jsonwebtoken');
// const { jwtSecrate } = require('../config/keys');
// const config = require("../config/keys");

// // Basic route handler for '/'
// router.get('/', (req, res) => {
//   res.send('User router');
// });

// // Route handler for adding a user with validation
// router.post('/', [
//   check("name").notEmpty().withMessage("Name is required"),
//   check("email").isEmail().withMessage("Valid email is required"),
//   check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
//   // Add more validation checks as needed...
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

   
    
//     const { name, email, password } = req.body;

//     // Check if user with the provided email already exists
//     let existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ errors: [{ msg: "User already exists" }] });
//     }

//     // Create a new User instance
//     const newUser = new User({ name, email, password });
    
//      const salt = await bcrypt.genSalt(10);
//      newUser.password = await bcrypt.hash(password, salt)
//     // Save the new user to the database
//     await newUser.save();

//     const payload = {
//       newUser : {
//         id : newUser.id,
//       }
//     }
//     jwt.sign(payload, config.jwtSecrate, { expiresIn: 3600 * 24 }, (err, token) => {
//       if (err) {
//         console.error('Error generating JWT:', err);
//         res.status(500).json({ error: 'Failed to generate token' }); // Respond with an error
//         return;
//       }
//       res.json({ token }); // Respond with the generated token
      
//     });

//      console.log(req.body)
//     // res.status(201).json({ msg: "User created successfully" });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;


const { Router } = require('express');
const router = Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt =  require ('jsonwebtoken');
const { jwtSecrate } = require('../config/keys');
const config = require("../config/keys");


router.get("/", (req, res) => res.send("Users route"));

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "please  password should have at least 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password, role } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        name,
        email,
        password,
        role,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //res.send("Users created");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
