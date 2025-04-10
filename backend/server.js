const express = require('express');
const cors = require('cors');
require('./app/config/connect');
require('dotenv').config();
require('./app/config/cronJob');
const paymentRouter=require('./app/payment/Routes/payment.Routes')
const userRouter=require('./app/User/Routes/user.Routes')
const blogRoute=require('./app/blog/router/blog.router')
const membershipRoute=require('./app/memberships/Routes/membership.Routes')
const chatRoute=require('./app/chat/router/chat.routes')
const { createAdminAccount } = require('./app/User/controllers/user.Controller');
const { startScheduler } = require('./app/config/scheduler'); 
const app = express();
app.use(express.json());
app.use(cors());

startScheduler();

app.use('/api/membership',membershipRoute)
app.use('/api/payments',paymentRouter)
app.use('/api/user',userRouter)
app.use('/api/blog',blogRoute)
app.use('/api/chat', chatRoute);
app.use('/files', express.static('./public'));
app.listen(3000, ()=>{
    console.log('server work');
    createAdminAccount();
  
})