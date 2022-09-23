import mongoose from "mongoose";
const { Schema } = mongoose;

const productDetailSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    },

    createdAt: Number,
    updatedAt: Number,

},
    { timestamps: true });

const productDetailModel = mongoose.model("productdetails", productDetailSchema);

export default productDetailModel;