import express from 'express'
import dotenv from 'dotenv';
import router from './route/product.js'
import connectDatabase from './database/connectDatabase.js'
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const port = process.env.PORT;


//Database Connection
connectDatabase();

// create application/json parser
app.use(bodyParser.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use('/product', router)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})