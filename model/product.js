import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },

    mrp: {
        type: Number,
        required: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    },

    createdAt: Number,
    updatedAt: Number,

},
    { timestamps: true, versionKey: false });


const productModel = mongoose.model("product", productSchema);

export default productModel;