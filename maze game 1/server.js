const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Serve socket.io.js from the installed package
app.get('/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'));
});

let games = {};

io.on('connection', (socket) => {
    socket.on('joinGame', ({ playerType, gameCode }) => {
        if (!games[gameCode]) {
            games[gameCode] = {};
        }
        games[gameCode][playerType] = socket.id;

        socket.join(gameCode);

        if (games[gameCode].bride && games[gameCode].groom) {
            io.to(gameCode).emit('gameJoined');
        }
    });

    socket.on('move', ({ playerType, direction, gameCode }) => {
        socket.to(gameCode).emit('move', { playerType, direction });
    });

    socket.on('disconnect', () => {
        for (const gameCode in games) {
            for (const playerType in games[gameCode]) {
                if (games[gameCode][playerType] === socket.id) {
                    delete games[gameCode][playerType];
                }
            }
            if (Object.keys(games[gameCode]).length === 0) {
                delete games[gameCode];
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
