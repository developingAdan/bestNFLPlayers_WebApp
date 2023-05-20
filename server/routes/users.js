// We create Routes to seperate our API endpoints into different routes

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrpyt from 'bcrypt';
import { UserModel } from "../models/Users.js"

const router = express.Router()


router.get("/", async (req, res) => {
    try {
    // const { username } = req.body;

    // // const user = await UserModel.find({})
    // const user = await UserModel.findById(req.body.userID)

    const { username, password } = req.body; // we get this via the frontend, when we log in, we get the username and password
    const user = await UserModel.findOne({ username: username });

    console.log(`LOGGED IN USER IS -- ${user}`)
    res.json(user)
    } catch (err) {
        console.error(err)
    } 
})

// router.post("/register", async (req, res) => {
//     const { username, password } = req.body;

//     const user = await UserModel.findOne({ username: username }); // here we are making request to the UserModel to check if the username === to the username var we got from req.body (above) 

//     if (user) {
//         return res.json({ message: "this user already exists"}); // here we are checking if a user already exists. if (user === true) essentially?
//     }

//     const hashedPassword = await bcrpyt.hash(password, 10); // this is where we create a version of our PW that is now hashed. We send this to our DB

//     const newUser = new UserModel({username, password: hashedPassword}); // this is where we add our user to the DB, with the username and hashed PW we want
//     await newUser.save(); // the user gets saved to the DB
//     res.json({ message: "User registered successfully"})
// });

// router.post("/login", async (req, res) => {
//     const { username, password } = req.body; // we get this via the frontend, when we log in, we get the username and password
//     const user = await UserModel.findOne({ username }); // here we get the *correct* user that should be logged in

//     if (!user) {
//         return res.status(400).json({ message: "user doesn't exist!"})
//     } // the problem is when we DON'T find a user, because that means you try to log in with an acct that doesn't exist

//     const isPasswordValid = await bcrpyt.compare(password, user.password); // here we check if the PW that is obtained matches the PW on the DB, using bcrypt.compare() function

//     if (!isPasswordValid) {
//         return res.status(400).json({ message: "username or password is incorrect!"})
//     }

//     const token = jwt.sign({ id: user._id }, "secret"); // this is how we create a json web token
//     res.json({ token, userID: user._id})


// })


router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await UserModel.findOne({ username: username });
  
      if (user) {
        return res.json({ message: "This user already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Username or password is incorrect" });
      }
  
      const token = jwt.sign({ id: user._id }, "secret");
      res.json({ token, userID: user._id });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

export { router as userRouter } // why export this as object? (Ask ChatGPT)

// under here is middleware we use to really authenticate the token we have inside the request. It'll run before each request 
export const verifyToken = (req, res, next) => { 

    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secret", (err) => {
            if (err) return res.sendStatus(403) // this authentication code tells us that this user is not authorized
            next(); // this means that IF the verification was done and no errors, then we SHOULD allow the user to proceed
        })
    } else {
        res.sendStatus(401); // this authentication status code tells us the authentication has failed or not been provided
    }
};