const { Schema } = require("mongoose")

const customersSchema = new Schema(
    {
        custmName: {
            type: String,
            required: [true, 'customer name is requird'],
        },
        custmPhone: {
            type: String,
            required: [true, 'phone is requird'],
            validate: {
                validator: function (v) {
                    return /^((\+)[0-9]{1,2})?(01)[0-9]{9}$/.test(v);
                },
                message: (props) => `${props.value} invalid phone >`
            }
        },
        custmEmail: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props) => `${props.value} invalid email >`
            }
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true
    }
);


module.exports = customersSchema;