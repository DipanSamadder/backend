const mongoose = require("mongoose");

const conn = async () =>{
    try {
        const response = await mongoose.connect(process.env.MONGOOSE_URL);
        if(response){
            console.log("connected to mongoose");
        } 
    } catch (error) {
            console.log(error);
            
    }
}

conn();