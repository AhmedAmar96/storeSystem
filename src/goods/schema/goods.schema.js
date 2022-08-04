const { Schema } = require("mongoose")

const goodsSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true, 'Product name is requird'],
        },
        theNum: {
            type: Number,
            required: [true, 'The number is requird'],
        },
        wholesalePrice: {
            type: Number,
            required: [true, 'Wholesale price is requird'],
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is requird'],
        },
        prodCode: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        workbooksId: {
            type: Schema.Types.ObjectId,
            ref: "workbooks"
        }
        // salesIds: [{
        //     type: Schema.Types.ObjectId,
        //     ref: "sales"
        //   }],
    },
    {
        timestamps: true
    }
);


module.exports = goodsSchema;