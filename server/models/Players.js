import mongoose from "mongoose" // this is how we structure our schemas

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    teams: [{
        type: String, required: true // this will be an ARRAY of objects (properties?), because there will be multiple ingrediants
    }],
    position: {
        type: String, 
        required: true,
    },
    imageUrl: {
        type: String, 
        required: true
    },
    cookingTime: {
        type: String,
        required: true
    },
    userOwner: { 
        type: mongoose.Schema.Types.ObjectId, // this is how we get the users "ObjectId" from the DB
        ref: "User", // I'm pretty sure this is referring to the "users" collection 
        required: true
    }
})


export const PlayerModel = mongoose.model("players", PlayerSchema)  // here we are sending the schema to be a collection, and we give it a name of "players"