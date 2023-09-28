import mongoose, { Schema, model, models } from "mongoose";

const AdressSchema = new Schema({
  userEmail: {type: String, unique: true, required:true},
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAdress: String,
  country: String,
},{versionKey: false, timestamps: true})

export const Adress = models?.Adress || model("Adress", AdressSchema)