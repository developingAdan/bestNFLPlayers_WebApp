import express from 'express';
import mongoose from 'mongoose';
import { PlayerModel } from "../models/Players.js";
import { UserModel } from "../models/Users.js"
import { verifyToken } from './users.js';

const router = express.Router();

router.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'same-origin');
    next();
  });

// this Route is what we call on our home page because we want to see our all our players displayed
router.get("/", async (req, res) => {
    try {
        const response = await PlayerModel.find({}); // this is how we get data from a certain collection or model. Since we do not specify a field or condition, it will get all the players documents 
        res.json(response)
    } catch (err) {
        res.json(err)
    }
}) 


// this Route is what we use to post a new player
router.post("/", verifyToken, async (req, res) => {
    const player = new PlayerModel(req.body) // here we create a new instance of the player being created 
    try {
        const response = await player.save(); // this is how we POST the player data to the collection
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

// this is the Route to save a player
router.put("/", verifyToken, async (req, res) => {
    
    try {
        const player = await PlayerModel.findById(req.body.playerID)
        const user = await UserModel.findById(req.body.userID)
        user.savedPlayers.push(player); // this is how we UPDATE our saved player we want to update
        await user.save(); // and here we save the changes into our collection
        res.json({ savedPlayers: user.savedPlayers }); // here we return back our saved players
    } catch (err) {
        res.json(err)
    }
})

// here in this route, in the FrontEnd we want to get a list of the player ID's that the user who's logged in has saved
// we GET all the players
router.get("/savedPlayers/ids/:userID", async(req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID) // first, here we get the user who has the ID that we send through the body
        res.json({ savedPlayers: user?.savedPlayers })
    } catch (err) {
        res.json(err)
    }
})

router.get("/savedPlayers/:userID", async(req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID) // first, here we get the user who has the ID that we send through the body
        const savedPlayers = await PlayerModel.find({
            _id: { $in: user.savedPlayers }, 
        }); // what we're saying here is we want to grab the 'savedPlayers' where their _id is inside the list of user.savedPlayers
            // this is logical notation that can be used with mongoose

        res.json({ savedPlayers })
    } catch (err) {
        res.json(err)
    }
})

// we don't need to add the verifyToken function to these two above ^ as we prohibit the ability to go to Saved Players page, unless logged in
// we do this for simplicity reasons, for right now

export { router as playersRouter }
