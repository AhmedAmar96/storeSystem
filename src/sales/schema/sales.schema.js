const { Schema } = require("mongoose")

const salesSchema = new Schema(
    {
        shopName: {
            type: String,
            default: "Galaxy Phone",
        },
        numOfProduct: {
            type: Number,
            default: 1,
        },
        totalBill: {
            type: Number,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "customers",
        },
        goodsId: [{
            type: Schema.Types.ObjectId,
            ref: "goods"
        }]

    },
    {
        timestamps: true
    }
);


module.exports = salesSchema;