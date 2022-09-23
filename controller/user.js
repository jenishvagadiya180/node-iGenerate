import userModel from "../model/user.js";
import mongoose from "mongoose";
import message from "../helper/message.js";

class user {
    static signUp = async (req, res) => {
        try {
            const user = new userModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                password: req.body.password,
            });

            const userData = await user.save();
            console.log('userData :>> ', userData);
            return res.status(200).send("data saved successfully");

        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    static signIn = async (req, res) => {
        try {
            const userData = await userModel.findOne({ mobile: req.body.mobile, isDeleted: false });
            if (!userData) {
                return res.status(400).send("user not found");
            }
            if (userData.mobile == req.body.mobile && userData.password == req.body.password) {
                const userObj = {
                    firstName: userData.firstName,
                    id: userData.id,
                    message: message.LOGIN_SUCCESSFUL
                }
                return res.status(200).send(userObj);
            }
            return res.status(400).send("user not found")
        } catch (error) {
            next(error)
        }
    }

}

export default user