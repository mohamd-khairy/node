const express = require("express");
var app = require("express")();
var server = require("http").Server(app);
const bodyParser = require("body-parser");
var io = require("socket.io")(server);
const cors = require("cors");
const UDP = require('dgram')
const serverUDP = UDP.createSocket('udp4')

app.use(cors("*"));
app.use(bodyParser.urlencoded({ limit: "9999999mb", extended: true }));
app.use(bodyParser.json({ limit: "9999999mb" }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/fanar.js")(app, io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("listening on *:" + port);
});

// const portUDP = 2222

// serverUDP.on('listening', () => {
//     // ServerUDP address it’s using to listen

//     const address = serverUDP.address()

//     console.log('Server UDP Listining to ', 'Address: ', address.address, 'Port: ', address.port)
// })

// serverUDP.on('message', (message, info) => {

//     const receivedData = JSON.parse(message.toString());
//     console.log('Received data:', receivedData);

//     // const response = Buffer.from('Message Received')

//     // //sending back response to client

//     // serverUDP.send(response, info.port, info.address, (err) => {
//     //   if (err) {
//     //     console.error('Failed to send response !!')
//     //   } else {
//     //     console.log('Response send Successfully')
//     //   }
//     // })
// })

// serverUDP.bind(portUDP)