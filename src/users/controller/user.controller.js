const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const sendEmail = require("../../../common/services/sendEmail");
const PaginationService = require("../../../common/services/PaginationService");
const findService = require("../../../common/services/findService");
const crtp = require('crypto');
const isOwner = require("../../../common/services/isOwner");

//get all users
const getUsersHandelr = async (req, res) => {
    const { searchKey, page, size } = req.query;
    const { skip, limit } = PaginationService(page, size);
    try {
        const data = await findService(User, skip, limit, searchKey, [
            "username"
        ], ["createdBy", "salesIds"])
        res.json({ message: "success", data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//Add user
const addUserHandelr = async (req, res) => {
    try {
        const { fullName, username, email, password, phone } = req.body;
        const userEmail = await User.findOne({ email });
        const userNameF = await User.findOne({ username });
        if (userEmail) {
            res
                .status(400)
                .json({ message: "email already exists" })
        }else if (userNameF){
            res
            .status(400)
            .json({ message: "username already exists" })
        } else {
            const newUser = new User({
                fullName,
                username,
                email,
                password,
                phone,
                userImage: `http://localhost:8080/uploads\\default.png`
            });
            const addData = await newUser.save();
            let token = jwt.sign({ _id: addData._id }, process.env.SECRET_KEY);
            sendEmail(
                process.env.SENDER,
                process.env.SENDER_PASSWORD,
                [email],
                "EMAIL VERFICATION",
                `<div style="text-align: center;">
                    <button style="background-color: #00008B;">
                        <a href="http://localhost:8080/verify/${token}" style="color: #fff; text-decoration: none;">click to verify</a>
                    </button>
                 </div>`
            )
            res.json({ message: "add user success", addData });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error ؟..", error: error.message });
    }
}

//sign in
const signInHandelr = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "email not found" });
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "5h" });
                if (!user.isVerifyed) {
                    res
                        .status(400)
                        .json({ message: "email is not verifyed" });
                } else {
                    //login
                    const data = await User.findOneAndUpdate({ email }, { Deactivate: false }).select("-password");
                    res
                        .status(StatusCodes.OK)
                        .json({ message: "login success", token, data });
                }
            } else {
                res
                    .status(400)
                    .json({ message: "password is not correct" });
            }
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
};

//verify
const verifyHandlr = async (req, res) => {
    try {
        const { token } = req.params;
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        const foundUser = await User.findOne({ _id: decoded._id })
        if (foundUser) {
            await User.updateOne({ _id: decoded._id }, { isVerifyed: true });
            res.json({ message: "Email is verifyed" })
        } else {
            res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "FORBIDDEN" })
        }
    } catch (error) {
        res
            .status(500)
            .json({ message: "error", error: error.message })
    }
}

//update user profile
const updateUserHandelr = async (req, res) => {
    try {
        const { username, phone } = req.body;
        const header = req.headers.authorization.split(" ")[1];
        const ownerStatus = await isOwner(User, header);
        if (ownerStatus) {
            const updateData = await User.updateOne({ _id: ownerStatus._id }, { username, phone });
            res.json({ message: "update user success", updateData });
        } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//update passowrd
const updatePassHandelr = async (req, res) => {
    try {
        const { oPassword, nPassword } = req.body;
        const header = req.headers.authorization.split(" ")[1];
        const ownerStatus = await isOwner(User, header);
        if (ownerStatus) {
            const match = await bcrypt.compare(oPassword, ownerStatus.password);
            if (!match) {
                res
                    .status(400)
                    .json({ message: "old password not correct" });
            } else {
                const updatePass = await User.updateOne({ _id: ownerStatus._id }, { password: nPassword });
                res.json({ message: "update password success", updatePass });
            }
        } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//forget password 
const forgetPassHandelr = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "email not found" });
        } else {
            const randPass = crtp.randomBytes(8).toString('hex');
            await User.updateOne({ email }, { password: randPass });
            const info = sendEmail(
                process.env.SENDER,
                process.env.SENDER_PASSWORD,
                [email],
                `Hello ${user.username}`,
                `<div style="text-align: center;">
                   your new password : ${randPass}
                 </div>`
            )
            if (info) {
                res
                    .json({ message: "Done" });
            } else {
                res
                    .json({ message: "error when sending" });
            }
        }
    } catch (error) {
        res
            .status(500)
            .json({ message: "error", error: error.message });
    }
}

//delete user
const deleteUserHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        await User.deleteOne({ _id });
        res.json({ message: "delete user success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//deactivate account
const deactAccountHandelr = async (req, res) => {
    try {
        const { _id } = req.params;
        await User.updateOne({ _id }, { Deactivate: true });
        res.json({ message: "deactive user success" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error", error: error.message });
    }
}

//add admin
const addAdminHandelr = async (req, res) => {
    try {
        const { username, email, password, phone, location } = req.body;
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            res
                .status(400)
                .json({ message: "email already exists" })
        } else {
            const newUser = new User({
                username,
                email,
                password,
                phone,
                location,
                role: "admin",
            });
            const addData = await newUser.save();
            let token = jwt.sign({ _id: addData._id }, process.env.SECRET_KEY);
            sendEmail(
                process.env.SENDER,
                process.env.SENDER_PASSWORD,
                [email],
                "EMAIL VERFICATION",
                `<div style="text-align: center;">
                    <button style="background-color: #00008B;">
                        <a href="http://localhost:8080/verify/${token}" style="color: #fff; text-decoration: none;">click to verify</a>
                    </button>
                 </div>`
            )
            res.json({ message: "sign up success", addData });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "error ؟..", error: error.message });
    }
}


module.exports = {
    getUsersHandelr,
    addUserHandelr,
    signInHandelr,
    updateUserHandelr,
    deleteUserHandelr,
    verifyHandlr,
    updatePassHandelr,
    forgetPassHandelr,
    addAdminHandelr,
    deactAccountHandelr
}
