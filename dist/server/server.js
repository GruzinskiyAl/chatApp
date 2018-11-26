"use strict"

const app = require("express")();
const http = require("http").Server(app);

const bodyParser = require("body-parser");

const WebSocket = require("ws");
const server = new WebSocket.Server({port: 8080})
const CLIENTS=[];

const MongoClient = require("mongodb").MongoClient;
let db = null;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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
            console.log(err);
            res.status = 500;
            return res.send(err);
        } else {
            console.log(doc);
            if (doc) {
                return res.status(200).send({"nick": doc.nick});
            } else {
                return res.status(400).send({1:2})
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
    CLIENTS.push(ws);

    ws.on("message", (dataJSON) => {
        let data = JSON.parse(dataJSON);

        if (data.header.action === "userConnection") {
            let userNick = data.body.user;
            ws.userNick = userNick;

            let responseObject = {
                "header": {
                    "action":"userConnection"
                },
                "body": {
                    "users": getActiveUsers()
                }
            };
            sendAll(responseObject);
        }

        if (data.header.action === "chatMessage") {
            let responseObject = {
                "header": {
                    "action": "chatMessage"
                },
                "body":{
                    "user": ws.userNick,
                    "message": data.body.message
                }
            };
            sendAll(responseObject);
        }

        if (data.header.action === "userDisconnection") {
            dropUserFromClients(ws); // drop user on web socket ds

            let responseObject = {
                "header": {
                    "action":"userDisconnection"
                },
                "body": {
                    "users": getActiveUsers()
                }
            };
            sendAll(responseObject);
        }
    });
})

function dropUserFromClients(client) {
    let index = CLIENTS.indexOf(client);
    if (index !== -1) CLIENTS.splice(index, 1);
}

function getActiveUsers() {
    return CLIENTS.map((ws) => {
        return ws.userNick
    })
}

function sendAll (responseObject) {
    for (let i=0; i<CLIENTS.length; i++) {
        if (CLIENTS[i].readyState === WebSocket.OPEN){
            CLIENTS[i].send(JSON.stringify(responseObject));
        }
    }
}


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

