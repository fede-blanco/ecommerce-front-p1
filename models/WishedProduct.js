import { Schema, model, models, Types} from "mongoose"
import { Product } from "./Product.js"

import mongoosePaginate from "mongoose-paginate-v2"

const WishedProductSchema = new Schema({
  userEmail:{type: String, required: true},
  product: {type: Types.ObjectId, ref: Product},
},{versionKey: false, timestamps: true})


WishedProductSchema.plugin(mongoosePaginate)

export const WishedProduct = models?.WishedProduct || model("WishedProduct", WishedProductSchema)