"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
class MessagePack {
    constructor(type, sender, cc, content, dateTime) {
        this.type = type;
        this.sender = sender;
        this.cc = cc;
        this.content = content;
        this.dateTime = dateTime;
    }
}
exports.MessagePack = MessagePack;
const frame = express();
const server = http.createServer(frame);
const webSocketServer = new WebSocket.Server({ server: server });
const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/TreeHollow";
const map = new WeakMap();
// webSocketServer.on('connection', function connection(ws, req) {
//     const address = req.connection.remoteAddress;
//     const port = req.connection.remotePort;
//     mongoClient.connect(url, function (err: Error, db: MongoClient) {
//         if (err) return err;
//         db.db('TreeHollow').collection('userLog').insertOne(messageJSON, function (err) {
//             if (err) return err;
//             db.close(function (err) {
//                 return err;
//             })
//         });
//     });
//     console.log(address + ':' + port);
// });
webSocketServer.on('connection', function connection(webSocket, req) {
    const address = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const onlineTime = Date.now();
    var user = '';
    console.log("connection success " + 'from ' + address + ':' + port + ' at ' + new Date());
    mongoClient.connect(url, function (err, db) {
        db.db('TreeHollow').collection('messageColl').find({}).toArray(function (err, result) {
            if (err)
                return err;
            webSocket.send(JSON.stringify(result));
            db.close(function (err) {
                return err;
            });
        });
    });
    webSocket.on('message', (messagePack) => {
        const messageJSON = JSON.parse(messagePack);
        if (messageJSON.type === 'online') {
            user = messageJSON.sender;
            map.set(webSocket, user);
        }
        else {
            mongoClient.connect(url, function (err, db) {
                if (err)
                    return err;
                db.db('TreeHollow').collection('messageColl').insertOne(messageJSON, function (err) {
                    if (err)
                        return err;
                    db.close(function (err) {
                        return err;
                    });
                });
            });
        }
        var messageArray = new Array();
        messageArray.push(messageJSON);
        webSocketServer.clients.forEach(function each(client) {
            if (client !== webSocket) {
                client.send(JSON.stringify(messageArray));
            }
        });
    });
    webSocket.on('close', () => {
        mongoClient.connect(url, function (err, db) {
            if (err)
                return err;
            db.db('TreeHollow').collection('userLog').insertOne({ address: address, port: port, user: user, onlineTime: onlineTime, offlineTime: Date.now() }, function (err) {
                if (err)
                    return err;
                db.close(function (err) {
                    return err;
                });
            });
        });
        if (map.has(webSocket)) {
            var messageArray = new Array();
            messageArray.push(new MessagePack('offline', map.get(webSocket), [], 'offline', Date.now()));
            webSocketServer.clients.forEach(function each(client) {
                if (client !== webSocket) {
                    client.send(JSON.stringify(messageArray));
                }
            });
        }
        console.log("connection closed " + 'from ' + address + ':' + port + ' at ' + new Date());
    });
});
server.listen(8999, () => {
    console.log("WebSocket Server ok " + new Date());
});
//# sourceMappingURL=server.js.map