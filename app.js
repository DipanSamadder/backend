const express = require('express');
const app = express();

const userRoute = require('./routes/userRoutes');
const taskRoute = require('./routes/taskRoutes');
const cors = require('cors');

require("dotenv").config();
require('./conn/conn');

app.use(cors());
app.use(express.json());



app.use('/api/v1/', userRoute);
app.use('/api/v2/', taskRoute);

// app.use('/', (req, res) => {
//     res.send("Hello express");
// });





const PORT = 1000;
app.listen(PORT, ()=>{
    console.log("Server start");
})