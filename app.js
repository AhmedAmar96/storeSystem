const express = require("express");
const app = express();
const cors = require('cors');
const dbConnection = require('./config/db');
const usersRoutes = require('./src/users/routes/user.routes');
const workbooksRoutes = require('./src/workbooks/routes/workbooks.routes');
const goodsRoutes = require('./src/goods/routes/goods.routes');
const salesRoutes = require('./src/sales/routes/sales.routes');
const customersRoutes = require('./src/customers/routes/customers.routes')
const upload = require("./common/services/uploadFile");
require("dotenv").config();
const port = process.env.PORT || 8080;


dbConnection();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(usersRoutes);
app.use(workbooksRoutes);
app.use(goodsRoutes);
app.use(salesRoutes);
app.use(customersRoutes);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

