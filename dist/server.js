const app = require("express")();
const bodyParser = require('body-parser');
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const dbHost = "mongodb://localhost:27017/"

MongoClient.connect(dbHost, (err, client)=>{

    if(err){
        return console.log(err);
    }
    const db = client.db("usersdb");
    const collection = db.collection("users");
    client.close();
});






app.post('/', (req, res)=>{
    let nickName = req.body["nickName"];
    let login = req.body.login;
    let password = req.body.password;

    mongoClient.connect(url, (err, client)=>{

        let user = {
            nickName,
            login,
            password
        };

        client.db.collection.insertOne(user, (err, result) => {
              
            if(err){ 
                res.statusCode = 400;
            }
            res.statusCode = 201;
            res.send(nickName)
            client.close();
        });
    });
});




http.listen(3000, ()=>{
    console.log("Server on http://localhost:3000");
})