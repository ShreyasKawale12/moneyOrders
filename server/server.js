import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import loginRoutes from './routes/loginRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { dirname } from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {aggregationQueries} from "./sqlQueries/aggregationQueries.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = createServer(app);
export const io = new SocketIOServer(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/',loginRoutes)
app.use('/', dashboardRoutes)
app.use('/', userRoutes)
app.use('/',adminRoutes)

io.on('connection', async (socket) => {
    const result= await aggregationQueries()
    console.log(result)
    io.emit('message',result)
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => { // Use the HTTP server to listen for requests, not the Express app
    console.log('Server is running on port 3000');
});
