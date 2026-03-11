/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Github, Code, Gamepad2, Megaphone, Palette } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const markdown = `<div align="center">
  <img src="https://www.dropbox.com/scl/fi/58oqkg1wabu3ny00csgu0/retouch_2026022813492948.png?rlkey=y4kljxf3qliing40y4ajl4tdo&st=cztf97hd&raw=1" width="100" />
  <img src="https://www.dropbox.com/scl/fi/ppotadbwlsa7jq5dpmo1u/retouch_2025101422042561.png?rlkey=3tfgwd4r2c6v0ps6w52ltqpk1&st=0oi5qj43&raw=1" width="100" />
  <img src="https://www.dropbox.com/scl/fi/v8e58xlicph5675x3umjf/retouch_2026012618114477.png?rlkey=l0zjyeb3w4josc1ytmm7mwmmj&st=vq2hj2hx&raw=1" width="100" />
</div>

# Hello Homo Sapiens 👋
I'm **Ansh, Ansh Bhardwaj**. I'm the Most Narcissistic Person you'll ever meet.

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
