const { Schema } = require("mongoose")

const workbooksSchema = new Schema(
    {
        workbooksType: {
            type: String,
            required: [true, 'Workbooks type is requird'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        // goodsIds: [{
        //     type: Schema.Types.ObjectId,
        //     ref: "goods"
        //   }],
    },
    {
        timestamps: true
    }
);



module.exports = workbooksSchema;