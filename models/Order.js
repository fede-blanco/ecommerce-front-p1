import { Schema, model, models } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const OrderSchema = new Schema({
  userEmail: String,
  line_items:Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAdress: String,
  country: String,
  totalPrice: Number,
  paid:Boolean,
},{versionKey: false, timestamps: true})

OrderSchema.plugin(mongoosePaginate)

export const Orders = models?.Orders || model("Orders", OrderSchema)

