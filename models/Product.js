import { Schema, model, models } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    category: {type: String},
    price: {type: Number, required: true},
    images: [{type: String}],
    properties: {type: Object}
},{versionKey: false, timestamps: true});

ProductSchema.plugin(mongoosePaginate)

export const Product = models?.Product || model('Product', ProductSchema);

