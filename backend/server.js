const express = require('express');
const cors = require('cors');
require('./app/config/connect');
require('dotenv').config();




const app = express();
app.use(express.json());
app.use(cors());




app.listen(3000, ()=>{
    console.log('server work');
  
})