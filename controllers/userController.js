const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register an user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (request, response) => {
  const { userName, email, password } = request.body;
  if (!userName || !email || !password) {
    response.status(400).json({ message: "All fields are mandatory!" });
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    response.status(400).json({ message: "User already registered!" });
  }
  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    userName,
    email,
    password: hashedPassword,
  });
  if (user) {
    response.status(201).json({ _id: user.id, email: user.email });
  } else {
    response.status(400).json({ message: "User data is not valid!!" });
  }
  response.json("Register new user..");
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    response
      .status(400)
      .json({ message: `${email ? "password" : "email"} are mandatory` });
  }
  const user = await User.findOne({ email });
  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    response.status(200).json({ accessToken });
  } else {
    response.status(401).json({ message: "Credentials are invalid" });
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (request, response) => {
  response.json(request.user);
});

module.exports = { registerUser, loginUser, currentUser };
