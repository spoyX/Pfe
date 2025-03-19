const express = require('express');
const cors = require('cors');
require('./app/config/connect');
require('dotenv').config();

const paymentRouter=require('./app/payment/Routes/payment.Routes')
const userRouter=require('./app/User/Routes/user.Routes')

const { createAdminAccount } = require('./app/User/controllers/user.Controller');
const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/payments',paymentRouter)
app.use('/api/user',userRouter)

app.use('/files', express.static('./public'));
app.listen(3000, ()=>{
    console.log('server work');
    createAdminAccount();
  
})