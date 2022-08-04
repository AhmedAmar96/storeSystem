const { ADMIN, USER } = require("../../enum/roles");
const adminPolicy = require("./adminPolicy");
const userPolicy = require("./userPolicy");

const opts = {
    [ADMIN]: adminPolicy,
    [USER]: userPolicy,
};
 
module.exports = opts;