
const express = require('express');
const app = express();
require('dotenv').config();
const customerRouter=require('./routes/customer');
const adminRouter=require('./routes/admin');
const driverRouter=require('./routes/driver');
const bodyParser=require('body-parser');

const mongoose = require("mongoose");

const mongoUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mx5gr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDb=()=> {
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
}


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
connectDb()
app.use('/customer', customerRouter);
app.use('/admin', adminRouter);
app.use('/driver' , driverRouter);

app.listen(3000, () => console.log('listening on port 3000'));


