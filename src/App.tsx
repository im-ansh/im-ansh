import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ExternalLink, Github, Code, Gamepad2, Megaphone, Palette, Users } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const PingPongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [joinId, setJoinId] = useState('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'playing'>('idle');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState('');

  useEffect(() => {
    // Connect to the default origin
    const newSocket = io({
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setLastError('');
    });

    newSocket.on('connect_error', (err) => {
      setLastError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('serverMessage', (msg) => {
      setLastError(`Server says: ${msg}`);
    });

    newSocket.on('roomCreated', (id) => {
      setRoomId(id);
      setStatus('waiting');
      setIsPlayer1(true);
    });

    newSocket.on('roomJoined', (id) => {
      setRoomId(id);
      setStatus('playing');
      setIsPlayer1(false);
    });

    newSocket.on('gameStart', () => {
      setStatus('playing');
    });

    newSocket.on('playerDisconnected', () => {
      setStatus('idle');
      setRoomId('');
      alert('Opponent disconnected!');
    });

    newSocket.on('error', (msg) => {
      setLastError(msg);
      alert(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing' || !socket) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      let y = mouseY - 40; // half paddle height
      if (y < 0) y = 0;
      if (y > canvas.height - 80) y = canvas.height - 80;
      
      socket.emit('paddleMove', { roomId, y });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    socket.on('gameState', (state) => {
      setScores({ player1: state.score1, player2: state.score2 });

      // Clear
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, state.width, state.height);

      // Draw net
      ctx.fillStyle = '#30363d';
      for (let i = 0; i < state.height; i += 40) {
        ctx.fillRect(state.width / 2 - 1, i, 2, 20);
      }

      // Draw Paddles
      ctx.fillStyle = '#58a6ff'; // P1
      ctx.fillRect(0, state.p1Y, state.paddleWidth, state.paddleHeight);
      
      ctx.fillStyle = '#ff7b72'; // P2
      ctx.fillRect(state.width - state.paddleWidth, state.p2Y, state.paddleWidth, state.paddleHeight);

      // Draw Ball
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#c9d1d9';
      ctx.fill();
      ctx.closePath();
    });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      socket.off('gameState');
    };
  }, [status, socket, roomId]);

  const createRoom = () => {
    if (!socket) {
      setLastError('Socket is not initialized yet.');
      return;
    }
    if (!isConnected) {
      setLastError('Not connected to server. Please wait or refresh.');
      return;
    }
    setLastError('');
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (!socket) {
      setLastError('Socket is not initialized yet.');
      return;
    }
    if (!isConnected) {
      setLastError('Not connected to server. Please wait or refresh.');
      return;
    }
    if (joinId.trim()) {
      setLastError('');
      socket.emit('joinRoom', joinId.trim());
    } else {
      setLastError('Please enter a room code.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 my-8 p-6 bg-[#161b22] border border-[#30363d] rounded-xl relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`}></div>
        <span className={isConnected ? 'text-[#3fb950]' : 'text-[#f85149]'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {lastError && (
        <div className="w-full bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] px-4 py-2 rounded-lg text-sm text-center mb-4">
          {lastError}
        </div>
      )}

      {status === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full max-w-[600px] py-8">
          <Gamepad2 className="w-16 h-16 text-[#8b949e]" />
          <h3 className="text-xl font-semibold text-white">Local Multiplayer Ping Pong</h3>
          <p className="text-[#8b949e] text-center max-w-md">
            Play with a friend on the same Wi-Fi network! One person creates a room, the other joins using the code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
            <button 
              onClick={createRoom}
              className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Create Room
            </button>
            <div className="flex flex-1 gap-2">
              <input 
                type="text" 
                placeholder="Room Code" 
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 text-white uppercase focus:outline-none focus:border-[#58a6ff]"
                maxLength={6}
              />
              <button 
                onClick={joinRoom}
                className="bg-[#1f6feb] hover:bg-[#388bfd] text-white px-4 rounded-lg font-medium transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'waiting' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-[600px] py-12">
          <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold text-white mt-4">Waiting for opponent...</h3>
          <p className="text-[#8b949e]">Share this room code with your friend:</p>
          <div className="bg-[#0d1117] border border-[#30363d] px-8 py-4 rounded-xl text-3xl font-mono text-white tracking-widest">
            {roomId}
          </div>
        </div>
      )}

      {status === 'playing' && (
        <>
          <div className="flex justify-between w-full max-w-[600px] px-4 font-mono text-xl">
            <span className="text-[#58a6ff]">P1: {scores.player1} {isPlayer1 && '(You)'}</span>
            <span className="text-white font-bold text-sm bg-[#30363d] px-3 py-1 rounded-full self-center">Room: {roomId}</span>
            <span className="text-[#ff7b72]">P2: {scores.player2} {!isPlayer1 && '(You)'}</span>
          </div>
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="bg-[#0d1117] border border-[#30363d] rounded-lg shadow-inner cursor-none w-full max-w-[600px] aspect-[3/2]"
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  const [copied, setCopied] = useState(false);

  const markdown = `<div align="center">
  <img src="https://www.dropbox.com/scl/fi/58oqkg1wabu3ny00csgu0/retouch_2026022813492948.png?rlkey=y4kljxf3qliing40y4ajl4tdo&st=cztf97hd&raw=1" width="100" />
  <img src="https://www.dropbox.com/scl/fi/ppotadbwlsa7jq5dpmo1u/retouch_2025101422042561.png?rlkey=3tfgwd4r2c6v0ps6w52ltqpk1&st=0oi5qj43&raw=1" width="100" />
  <img src="https://www.dropbox.com/scl/fi/v8e58xlicph5675x3umjf/retouch_2026012618114477.png?rlkey=l0zjyeb3w4josc1ytmm7mwmmj&st=vq2hj2hx&raw=1" width="100" />
</div>

# Hello Homo Sapiens 👋
I'm **Ansh, Ansh Bhardwaj**. I'm the Most Narcissistic Person you'll ever meet.

### 🏓 Ping Pong
<div align="center">
  <img src="ping-pong.svg" alt="Ping Pong SVG Game" />
</div>
*GitHub doesn't support playable games in READMEs, but you can [play the real version here!](https://pingpongansh.vercel.app)*

### ✨ Some of my qualities are
- 💻 Coding
- 🎨 Graphic Designing
- 🎮 Game Development
- 📈 Marketing

### 🚀 My projects include
1. **LoveMatch AI** (Discontinued) - [lovematch-ai.vercel.app](https://lovematch-ai.vercel.app)
2. **Rigor AI** (Discontinued) - [rigorai.vercel.app](https://rigorai.vercel.app)
3. **Cafftrack** - [cafftrack.vercel.app](https://cafftrack.vercel.app)
4. **Fukrey Boys** (School Yearbook website) - [fukrey-boys.vercel.app](https://fukrey-boys.vercel.app)
5. **Marco** - [marco-neon.vercel.app](https://marco-neon.vercel.app)
6. **Labrador** - [labrador-xi.vercel.app](https://labrador-xi.vercel.app)

### ✍️ Here's my Blog
[ansh-bhardwaj.bearblog.dev](https://ansh-bhardwaj.bearblog.dev/)

### 🎬 Favorite Gifs
<div align="center">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyYmg5bGFiajkyZmluZWNwamR5d2YxZ3IyNXIxNnM0YjRsdTV0Z3h1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13M4Ki3u5orBe0/giphy.gif" width="250" />
  <img src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybnducjg5amFna2w3enQwNHB3Z2Z4dGdwdmwyMnlieW02MXExOHR6aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QYn97FfN2QNd4wtGQw/giphy.gif" width="250" />
  <img src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyaDBuOHhxMDA1bzlhZGZ1ZTVidDR6NmNpdG9wcWlhYTZ4MXVvM3l0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u5xNL7P4xsCNvLYuiV/giphy.gif" width="250" />
</div>
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white pb-12">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Header / Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 border-b border-[#30363d] pb-6 gap-4">
          <div className="flex items-center gap-3">
            <Github className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-semibold text-white">Ansh's GitHub Readme</h1>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Markdown!' : 'Copy Markdown'}
          </button>
        </div>

        {/* Readme Preview Container */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-xs text-[#8b949e] font-mono">README.md</span>
          </div>
          
          <div className="p-8 md:p-12 prose prose-invert max-w-none">
            
            {/* 1. Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <img 
                src="https://www.dropbox.com/scl/fi/58oqkg1wabu3ny00csgu0/retouch_2026022813492948.png?rlkey=y4kljxf3qliing40y4ajl4tdo&st=cztf97hd&raw=1" 
                alt="Labrador Founder's badge" 
                className="h-24 md:h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://www.dropbox.com/scl/fi/ppotadbwlsa7jq5dpmo1u/retouch_2025101422042561.png?rlkey=3tfgwd4r2c6v0ps6w52ltqpk1&st=0oi5qj43&raw=1" 
                alt="Rigor AI Founder badge" 
                className="h-24 md:h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://www.dropbox.com/scl/fi/v8e58xlicph5675x3umjf/retouch_2026012618114477.png?rlkey=l0zjyeb3w4josc1ytmm7mwmmj&st=vq2hj2hx&raw=1" 
                alt="Game Developer badge" 
                className="h-24 md:h-32 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 2. Bio */}
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight border-b border-[#30363d] pb-4">
                Hello Homo Sapiens 👋
              </h1>
              <p className="text-xl text-[#8b949e] leading-relaxed">
                I'm <strong className="text-white">Ansh, Ansh Bhardwaj</strong>. I'm the Most Narcissistic Person you'll ever meet.
              </p>
            </div>

            {/* Ping Pong Game */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-[#30363d] pb-2">
                🏓 Ping Pong
              </h2>
              <div className="flex flex-col items-center gap-4 mb-8">
                <img src="/ping-pong.svg" alt="Ping Pong Animation" className="w-full max-w-[600px] rounded-xl shadow-lg border border-[#30363d]" />
                <p className="text-[#8b949e] text-center text-sm">
                  *GitHub doesn't support playable games in READMEs, but you can <a href="https://pingpongansh.vercel.app" target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline">play the real version here!</a>*
                </p>
              </div>
              
              <div className="bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
                <h3 className="text-lg font-medium text-white mb-4 text-center">Playable Multiplayer Version (Website Only)</h3>
                <PingPongGame />
              </div>
            </div>

            {/* Qualities */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-[#30363d] pb-2">
                ✨ Some of my qualities are
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[#8b949e] transition-colors">
                  <Code className="w-6 h-6 text-[#58a6ff]" />
                  <span className="font-medium text-center">Coding</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[#8b949e] transition-colors">
                  <Palette className="w-6 h-6 text-[#ff7b72]" />
                  <span className="font-medium text-center">Graphic Designing</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[#8b949e] transition-colors">
                  <Gamepad2 className="w-6 h-6 text-[#3fb950]" />
                  <span className="font-medium text-center">Game Development</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[#8b949e] transition-colors">
                  <Megaphone className="w-6 h-6 text-[#d2a8ff]" />
                  <span className="font-medium text-center">Marketing</span>
                </div>
              </div>
            </div>

            {/* 3. Projects */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-[#30363d] pb-2">
                🚀 My projects include
              </h2>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">01.</span>
                  <strong className="text-white text-lg">LoveMatch AI</strong>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#da3633]/20 text-[#ff7b72] border border-[#da3633]/30 w-fit">Discontinued</span>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://lovematch-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      lovematch-ai.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
                
                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">02.</span>
                  <strong className="text-white text-lg">Rigor AI</strong>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#da3633]/20 text-[#ff7b72] border border-[#da3633]/30 w-fit">Discontinued</span>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://rigorai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      rigorai.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">03.</span>
                  <strong className="text-white text-lg">Cafftrack</strong>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://cafftrack.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      cafftrack.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">04.</span>
                  <strong className="text-white text-lg">Fukrey Boys</strong>
                  <span className="text-sm text-[#8b949e]">(School Yearbook website)</span>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://fukrey-boys.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      fukrey-boys.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">05.</span>
                  <strong className="text-white text-lg">Marco</strong>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://marco-neon.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      marco-neon.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] transition-colors group">
                  <span className="text-[#8b949e] font-mono text-sm w-6">06.</span>
                  <strong className="text-white text-lg">Labrador</strong>
                  <div className="md:ml-auto flex items-center gap-2 mt-2 md:mt-0">
                    <a href="https://labrador-xi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline flex items-center gap-1 text-sm">
                      labrador-xi.vercel.app <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* 4. Blog */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-[#30363d] pb-2">
                ✍️ Here's my Blog
              </h2>
              <a 
                href="https://ansh-bhardwaj.bearblog.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 rounded-xl bg-gradient-to-r from-[#161b22] to-[#21262d] border border-[#30363d] hover:border-[#58a6ff] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#58a6ff] transition-colors">Ansh's Bear Blog</h3>
                    <p className="text-[#8b949e] mt-1">Read my latest thoughts and articles.</p>
                  </div>
                  <div className="bg-[#30363d] p-3 rounded-full group-hover:bg-[#58a6ff]/20 transition-colors">
                    <ExternalLink className="w-6 h-6 text-white group-hover:text-[#58a6ff]" />
                  </div>
                </div>
              </a>
            </div>

            {/* 5. Gifs */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-[#30363d] pb-2">
                🎬 Favorite Gifs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22] shadow-lg">
                  <img 
                    src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyYmg5bGFiajkyZmluZWNwamR5d2YxZ3IyNXIxNnM0YjRsdTV0Z3h1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13M4Ki3u5orBe0/giphy.gif" 
                    alt="Favorite Gif 1" 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22] shadow-lg">
                  <img 
                    src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybnducjg5amFna2w3enQwNHB3Z2Z4dGdwdmwyMnlieW02MXExOHR6aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QYn97FfN2QNd4wtGQw/giphy.gif" 
                    alt="Favorite Gif 2" 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22] shadow-lg">
                  <img 
                    src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyaDBuOHhxMDA1bzlhZGZ1ZTVidDR6NmNpdG9wcWlhYTZ4MXVvM3l0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u5xNL7P4xsCNvLYuiV/giphy.gif" 
                    alt="Favorite Gif 3" 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-[#8b949e] text-sm">
          <p>Designed for Ansh Bhardwaj's GitHub Profile</p>
        </div>

      </div>
    </div>
  );
}
