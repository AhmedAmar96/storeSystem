const { Schema } = require("mongoose")
const bcrypt = require("bcrypt");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
 
const userSchema = new Schema(
    { 
        fullName: {
            type: String,
            required: [true, 'full name is requird'],
        },
        username: {
            type: String,
            required: [true, 'username is requird'],
            validate: {
                validator: function (v) {
                    return /^\S*$/.test(v);
                },
                message: (props) => `${props.value} invalid username >`
            }
        },
        email: {
            type: String,
            required: [true, 'email is requird'],
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props) => `${props.value} invalid email >`
            }
        },
        password: {
            type: String,
            required: [true, 'password is requird'],
        },
        phone: {
            type: String,
            required: [true, 'phone is requird'],
            validate: {
                validator: function (v) {
                    return /^((\+)[0-9]{1,2})?(01)[0-9]{9}$/.test(v);
                },
                message: (props) => `${props.value} invalid phone >`
            }
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerifyed: {
            type: Boolean,
            default: false
        },
        Deactivate: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

//hooks
userSchema.pre("save", async function (next) {
    console.log("pre save hash password and encrypt phone");
    if (this.password && this.phone) {
        this.password = await bcrypt.hash(this.password, 7);
        this.phone = cryptr.encrypt(this.phone);
        next();
    }
})

userSchema.pre("updateOne", async function (next) {
    try {
        console.log("pre update hash password");
        // console.log(this);
        if (this._update.password) {
            // console.log(this)
            this._update.password = await bcrypt.hash(this._update.password, 7);
            next();
        } else {
            next();
        }
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = userSchema;