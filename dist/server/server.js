"use strict"

const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require('body-parser');
const io = require("socket.io")(http);

const MongoClient = require("mongodb").MongoClient;
let db = null;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.post('/user/login/', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    db.collection("users").findOne({login: login ,password: password}, (err, doc) => {

        if (err) {
            res.statusCode = 500;
            return res.send(err);
        } else {

            if (doc){
                res.statusCode = 200;
                return res.send({"nick": doc.nick});
            } else {
                res.statusCode = 400;
                return res.send("Check your login or password!")
            }
        }
    })
});

app.post('/user/registration/', (req, res)=>{
    const nick = req.body.nick;
    const login = req.body.login;
    const password = req.body.password;

    const user = {
        nick,
        login,
        password
    };

    db.collection("users").find({"login": login}).toArray((err, doc) =>{

        if (err) {
            res.statusCode = 500;
            return res.send(err);
        } else {

            if (doc.length >= 1) {
                res.statusCode = 400;
                return res.send("Login is already in use!");
            } else {
                db.collection("users").insertOne(user, (err, result) => {

                    if (err) {
                        res.statusCode = 500;
                        return res.send(err);
                    } else {
                        res.statusCode = 201;
                        return res.send({nick});
                    }
                })
            }
        }
    })
});


MongoClient.connect("mongodb://localhost:27017/", (err, database) => {
    if (err) {
        console.log(err)
    } else {
        db = database.db("usersdb");
        http.listen(3000, () => {
            console.log("Server on http://localhost:3000");
        })
    }
})

