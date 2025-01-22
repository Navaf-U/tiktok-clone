import jwt from 'jsonwebtoken';
export const users = new Map();
const setupSocket = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
          jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
            if (err) {
              return next(new Error("Authentication error"));
            }
            socket.user = user;
            next();
          });
        } else {
          next(new Error("Authentication error"));
        }    
      })
  
    io.on('connection', (socket) => {
        // this will run when user connects
      socket.on('join', () => {
        users.set(socket.user.id, socket.id);
      });
  
  
      // this will run when the user disconnects
      socket.on('disconnect', () => {
        if (socket.user.id) {
          users.delete(socket.user.id);
        }
      });
    });
  };

export default setupSocket;