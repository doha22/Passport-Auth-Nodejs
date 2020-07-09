const http = require('http') ;



var mongoose = require('mongoose');

require('dotenv').config();

bodyParser = require('body-parser');

const cors =require('cors')
// import express
const express = require('express') ;

const app = express();

app.use(cors());
app.use(express.json());



app.use(bodyParser.urlencoded({extended: true})  );
app.use(bodyParser.json()) ;



// mongodb connection 

try{

const uri = "mongodb+srv://admin:1234@cluster0-14764.mongodb.net/<UserAuthPass>?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true }
  );
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
  });

}catch (err) {
    console.error(err.message);
}



const users = require('./routes/user');   





 


app.use(users);

// creating middle for if site is down or not accepting request 
app.use((req , res , next)=>{
 res.status(503).send("site is currently down , try later");
})











const server = http.createServer(app);

server.listen(8888);