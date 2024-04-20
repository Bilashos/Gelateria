const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const notificationRoutes = require('./routes/notify.route');
const token = require('./middlewares/token');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET, POST, PUT, DELETE']
  }
});

let socketsByUsername = {}


// Middleware per gestire le richieste CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    req.socketServer = io;
    next();
});

const port = process.env.PORT || 3000;

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/notification', notificationRoutes);
app.use(token.verifyToken);
io.on('connection', (socket) => {
    console.log('Nuova connessione socket:', socket.id);
    let token = socket.handshake.headers.authorization.replace("Bearer ", "");
    getUsernameFromJWT(token, (err, user) => {
        if(user) {
            let username = user.username;
            socketsByUsername[username] = socket;
            socket.on('test', (data) => {
                console.log("message: " + JSON.stringify(data)); //in console mandare messaggio emit di test --> lui ascolta
            })

            socket.on('sendNotification', (data) => {
                let username = data.username;
                let userSocket = socketsByUsername[username];
                if (userSocket)
                    userSocket.emit('notification', data);
                console.log('Richiesta di notifica ricevuta:', data);
                // Invia la notifica a tutti i client connessi
                //io.emit('notification', data); //invia a tutti
            });
            socket.on('messageSent', (data) =>{
                let to = data.to;
                let userSocket = socketsByUsername[to];
                if(userSocket) {
                    data.to = '';
                    console.log(data);
                    data.from = username;
                    userSocket.emit('newMessage', data);
                }
            });
        }
    })
});

//socket.emit("welcome", "benvenuto nel socket, " + socket.id); //singolo
//io.emit("welcome", "nuova connessione: " + socket.id); //broadcast
//socket.broadcast.emit('notification', data); // non invia a se stesso

function getUsernameFromJWT(token, callback){
    return jwt.verify(token, 'chiaveSegreta', callback);
}

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

