import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
    },

    isCheckout: {
        type: Boolean,
        default: false,
    },

    productId: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },

    amount: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

    createdAt: Number,
    updatedAt: Number,

},
    { timestamps: true });


const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;