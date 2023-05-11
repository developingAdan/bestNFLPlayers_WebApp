import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    savedPlayers: [{type: mongoose.Schema.Types.ObjectId, ref: "Player" }] // here we are getting a list of ObjectId (which are the players) and referencing players

})


export const UserModel = mongoose.model("users", UserSchema) // here we are sending the schema to be a collection, and we give it a name of "users"