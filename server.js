const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname)));

const users = new Map();
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (userData) => {
        const { username, userType } = userData;
        users.set(socket.id, { username, userType, socketId: socket.id });
        
        socket.emit('user-connected', { 
            userId: socket.id, 
            username, 
            userType 
        });
        
        socket.broadcast.emit('user-joined', { 
            userId: socket.id, 
            username, 
            userType 
        });
    });

    socket.on('send-message', (messageData) => {
        const user = users.get(socket.id);
        if (user) {
            const message = {
                id: uuidv4(),
                text: messageData.text,
                sender: user.username,
                userType: user.userType,
                timestamp: new Date().toISOString()
            };
            
            io.emit('receive-message', message);
        }
    });

    socket.on('call-user', (data) => {
        const { to, offer, callType } = data;
        const caller = users.get(socket.id);
        
        socket.to(to).emit('incoming-call', {
            from: socket.id,
            caller: caller.username,
            offer,
            callType
        });
    });

    socket.on('answer-call', (data) => {
        const { to, answer } = data;
        socket.to(to).emit('call-answered', { answer });
    });

    socket.on('ice-candidate', (data) => {
        const { to, candidate } = data;
        socket.to(to).emit('ice-candidate', { candidate });
    });

    socket.on('end-call', (data) => {
        const { to } = data;
        socket.to(to).emit('call-ended');
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            socket.broadcast.emit('user-left', { 
                userId: socket.id, 
                username: user.username 
            });
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Car Chat App running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📱 Local URL: http://localhost:${PORT}`);
    }
});