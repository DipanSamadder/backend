const router = require("express").Router();
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SignUp api
router.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required!" });
    }

    // Check if name is at least 3 characters long
    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "User name should be more than 3 characters" });
    }

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    // Check if the user or email already exists
    const existUser = await User.findOne({ name });
    const existEmail = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (existEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const hashPass = await bcrypt.hash(req.body.password, 10);

    // Create and save the new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signup successful." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//SignIn api
router.post("/signin", async (req, res) => {
  try {
    const { password, email } = req.body;
    console.log(req.body);

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required!" });
    }

    // Check if the user or email already exists
    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    bcrypt.compare(password, existUser.password, (err, data) => {
      if (data) {
        //const auth = [{name:existUser.name}, { jti: jwt.sign({}, "DIPAN")}];
        const auth = existUser._id;
        const token = jwt.sign({ auth }, "DIPAN", { expiresIn: "2d" });
        return res.status(200).json({ id: existUser._id, token: token });
      } else {
        return res.status(400).json({ message: err });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
