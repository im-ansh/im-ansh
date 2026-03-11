import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // Game state management
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", () => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      rooms.set(roomId, {
        p1: socket.id,
        p2: null,
        state: {
          ballX: 300, ballY: 200,
          ballSpeedX: 5, ballSpeedY: 5,
          p1Y: 160, p2Y: 160,
          score1: 0, score2: 0,
          width: 600, height: 400,
          paddleHeight: 80, paddleWidth: 10, ballRadius: 8
        },
        interval: null
      });
      socket.join(roomId);
      socket.emit("roomCreated", roomId);
    });

    socket.on("joinRoom", (roomId) => {
      roomId = roomId.toUpperCase();
      const room = rooms.get(roomId);
      if (room && !room.p2) {
        room.p2 = socket.id;
        socket.join(roomId);
        socket.emit("roomJoined", roomId);
        io.to(roomId).emit("gameStart", { p1: room.p1, p2: room.p2 });

        // Start game loop
        room.interval = setInterval(() => {
          const state = room.state;
          // Move ball
          state.ballX += state.ballSpeedX;
          state.ballY += state.ballSpeedY;

          // Top/bottom collision
          if (state.ballY - state.ballRadius < 0 || state.ballY + state.ballRadius > state.height) {
            state.ballSpeedY = -state.ballSpeedY;
          }

          // Paddle collision
          // P1 (Left)
          if (state.ballX - state.ballRadius < state.paddleWidth) {
            if (state.ballY > state.p1Y && state.ballY < state.p1Y + state.paddleHeight) {
              state.ballSpeedX = -state.ballSpeedX;
              state.ballSpeedY = (state.ballY - (state.p1Y + state.paddleHeight / 2)) * 0.2;
            } else if (state.ballX < 0) {
              state.score2++;
              resetBall(state);
            }
          }

          // P2 (Right)
          if (state.ballX + state.ballRadius > state.width - state.paddleWidth) {
            if (state.ballY > state.p2Y && state.ballY < state.p2Y + state.paddleHeight) {
              state.ballSpeedX = -state.ballSpeedX;
              state.ballSpeedY = (state.ballY - (state.p2Y + state.paddleHeight / 2)) * 0.2;
            } else if (state.ballX > state.width) {
              state.score1++;
              resetBall(state);
            }
          }

          io.to(roomId).emit("gameState", state);
        }, 1000 / 60);
      } else {
        socket.emit("error", "Room full or not found");
      }
    });

    socket.on("paddleMove", ({ roomId, y }) => {
      const room = rooms.get(roomId);
      if (room) {
        if (socket.id === room.p1) room.state.p1Y = y;
        if (socket.id === room.p2) room.state.p2Y = y;
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        if (room.p1 === socket.id || room.p2 === socket.id) {
          if (room.interval) clearInterval(room.interval);
          io.to(roomId).emit("playerDisconnected");
          rooms.delete(roomId);
        }
      });
    });
  });

  function resetBall(state: any) {
    state.ballX = state.width / 2;
    state.ballY = state.height / 2;
    state.ballSpeedX = -state.ballSpeedX;
    state.ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
