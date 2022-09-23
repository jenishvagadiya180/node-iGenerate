import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
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


const userModel = mongoose.model("user", userSchema);

export default userModel;