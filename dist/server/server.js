"use strict"

const app = require("express")();
const http = require("http").Server(app);

const bodyParser = require("body-parser");

const WebSocket = require("ws");
const server = new WebSocket.Server({port: 8080})


const MongoClient = require("mongodb").MongoClient;
let db = null;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});


app.post('/user/login/', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    db.collection("users").findOne({login: login ,password: password}, (err, doc) => {

        if (err) {
            res.status = 500;
            return res.send(err);
        } else {

            if (doc){
                res.status = 200;
                return res.send({"nick": doc.nick});
            } else {
                res.status = 400;
                return res.send("Check your login or password!")
            }
        }
    })
});

app.post('/user/registration/', (req, res) => {
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
            return res.status(500).send(err);
        } else {

            if (doc.length >= 1) {
                return res.status(400).send("Login is already in use!");
            } else {
                db.collection("users").insertOne(user, (err, result) => {

                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(201).send({nick});
                    }
                })
            }
        }
    })
});

server.on("connection", (ws) => {
    ws.send("Hi");
})



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

