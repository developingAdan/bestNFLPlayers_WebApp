// this is how we start our server

import dotenv from "dotenv";

import express from 'express' // express services a framework to create our API. it serves our frontend
import cors from 'cors' // a library that sets up rules that allows communication between frontend and backend
import mongoose from 'mongoose' // a ____ for MongoDB. This sets up the DB management system, it allows us to write queries and other communications to our DB in a simpler way

import { userRouter } from '../routes/users.js' // since we are using "import" notation, we have to include ext (Ex. "users.js" instead of just "users")
import { playersRouter } from '../routes/players.js' // since we are using "import" notation, we have to include ext (Ex. "users.js" instead of just "users")
import dbConnect from '../dbConnect.js'

dotenv.config();

const app = express();

dbConnect();
// this generates a connection to our server


app.use(express.json()); // this middleware allows for all data being sent from the FrontEnd, to be converted to JSON. We use this as this gives us data from the FrontEnd in an easy-to-understand manner
app.use(cors());

app.use("/auth", userRouter); // "/auth" is the endpoint we want to set this up with. Here we are seperating our code so that we can write endpoints that are related to authentication, will exist in the "users.js" file. We are using it this way so that Express knows what we are doing
app.use("/players", playersRouter);
app.use("/users", userRouter)

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'same-origin');
    next();
  });



const port = process.env.PORT || 8081;

app.listen(port, () => console.log(`Server has started on port ${port}`)) // this tells our API to start
