
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Monitor, Terminal, Disc, FileText, Image as ImageIcon, Settings,
  Mail, Globe, Smile, User, ShoppingBag, Code, Folder,
  Search, Menu, X, Minus, Square, Power, LogOut, RefreshCw,
  Cpu, Wifi, Volume2, Battery, Calendar, Download, Trash2,
  Maximize2, Minimize2, Edit3, Type, Play, Pause, SkipForward, SkipBack,
  Grid, List, Check, Music
} from 'lucide-react';

// --- Types & Constants ---

type WindowState = 'normal' | 'maximized' | 'minimized';

interface AppWindow {
  id: string;
  appId: string;
  title: string;
  icon: React.ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: WindowState;
  data?: any;
}

interface AppDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.FC<{ windowId: string }>;
  defaultWidth?: number;
  defaultHeight?: number;
  url?: string;
}

const WALLPAPER_DEFAULT = 'https://voicebanks.imikufans.com/wid.jpg';
const BOOT_LOGO = 'https://voicebanks.imikufans.com/ava.jpg';
const USERNAME = 'Jiajun Zhang';

// --- Apps Components ---

const BrowserApp: React.FC<{ windowId: string }> = () => {
  const [url, setUrl] = useState('https://www.imikufans.com');
  const [inputUrl, setInputUrl] = useState(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const go = () => {
    let target = inputUrl;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex p-2 gap-2 bg-gray-100 border-b border-gray-300 items-center">
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" onClick={() => { setUrl('https://www.google.com'); setInputUrl('https://www.google.com'); }}>
          <Globe size={16}/>
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" onClick={() => iframeRef.current?.contentWindow?.history.back()}>
           ←
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" onClick={() => iframeRef.current?.contentWindow?.history.forward()}>
           →
        </button>
        <input 
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:border-emerald-500 focus:outline-none"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          onFocus={(e) => e.target.select()}
        />
        <button onClick={go} className="px-4 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 shadow-sm">Go</button>
      </div>
      <iframe 
        ref={iframeRef}
        src={url} 
        className="flex-1 w-full h-full border-none bg-white" 
        title="Browser" 
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals" 
      />
    </div>
  );
};

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [lastOp, setLastOp] = useState(false);

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      setLastOp(false);
    } else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(equation + display);
        setDisplay(String(Number(res.toFixed(8)))); // clean float precision
        setEquation('');
        setLastOp(true);
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(equation + display + val);
      setDisplay('0');
      setLastOp(false);
    } else {
      if (lastOp) {
        setDisplay(val);
        setLastOp(false);
      } else {
        setDisplay(display === '0' ? val : display + val);
      }
    }
  };

  const btns = [
    '7','8','9','/',
    '4','5','6','*',
    '1','2','3','-',
    '0','.','=','+',
    'C'
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 p-3 select-none">
      <div className="bg-[#a8bba8] h-20 mb-3 rounded-sm text-right text-4xl p-2 font-mono overflow-hidden flex items-end justify-end shadow-inner text-gray-800 tracking-widest">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {btns.map(b => (
          <button 
            key={b} 
            onClick={() => handlePress(b)}
            className={`rounded font-bold text-xl shadow-sm transition-all active:scale-95 active:shadow-inner flex items-center justify-center
              ${b === 'C' ? 'bg-red-600 hover:bg-red-500 text-white col-span-4 h-12 mt-1' : 
                b === '=' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 
                ['+','-','*','/'].includes(b) ? 'bg-gray-700 hover:bg-gray-600 text-emerald-400' : 'bg-gray-200 hover:bg-white text-gray-900'}`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

const MusicPlayerApp: React.FC = () => {
  const tracks = [
    { title: 'Xi Ri Yin Xiang', url: 'https://www.imikufans.com/xryx.mp3' },
    { title: 'Hitori', url: 'https://www.imikufans.com/hitori.mp3' },
    { title: 'Chun Lai', url: 'https://www.imikufans.com/cl.mp3' },
  ];
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url;
      if (playing) audioRef.current.play().catch(e => console.error(e));
    }
  }, [currentTrack]);

  useEffect(() => {
    const el = audioRef.current;
    if(!el) return;
    const update = () => setProgress((el.currentTime / el.duration) * 100 || 0);
    el.addEventListener('timeupdate', update);
    return () => el.removeEventListener('timeupdate', update);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.error(e));
      setPlaying(!playing);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 text-emerald-50 p-6">
      <div className="flex-1 flex flex-col items-center justify-center relative">
         <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className={`w-32 h-32 rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center bg-gray-900 mb-6 ${playing ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
             <Music size={24} className="text-gray-900"/>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md">{tracks[currentTrack].title}</h2>
        <div className="text-sm text-emerald-400 font-medium">iMikufans Audio</div>
      </div>
      
      <div className="w-full bg-gray-700 h-1.5 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex justify-center items-center gap-6 pb-2">
        <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)}>
          <SkipBack size={28} />
        </button>
        <button onClick={togglePlay} className="p-4 bg-emerald-500 rounded-full text-white hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-900/50">
          {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}>
          <SkipForward size={28} />
        </button>
      </div>
      <audio ref={audioRef} onEnded={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)} />
      
      <div className="mt-6 border-t border-gray-700 pt-4 space-y-1 overflow-y-auto max-h-32">
        {tracks.map((t, i) => (
          <div 
            key={i} 
            onClick={() => { setCurrentTrack(i); setPlaying(true); }}
            className={`p-2 rounded cursor-pointer text-xs flex items-center gap-3 transition-colors ${i === currentTrack ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:bg-white/5 text-gray-400'}`}
          >
             <span className="w-4 text-center">{i + 1}</span>
             <span className="flex-1">{t.title}</span>
             {i === currentTrack && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill white on init
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const start = (e: MouseEvent) => {
      isDrawing.current = true;
      draw(e);
    };
    const end = () => {
       isDrawing.current = false;
       ctx.beginPath(); // Reset path
    };
    const draw = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('mouseleave', end);
      canvas.removeEventListener('mousemove', draw);
    };
  }, [color, size]);

  const download = () => {
    const link = document.createElement('a');
    link.download = `imiku-paint-${Date.now()}.png`;
    link.href = canvasRef.current?.toDataURL() || '';
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center gap-3 p-2 bg-gray-200 border-b border-gray-300 shadow-sm z-10">
        <div className="flex items-center gap-1 bg-white p-1 rounded border">
           <div className="w-4 h-4 rounded-full" style={{background: color}}></div>
           <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 opacity-0 absolute cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
           <div className="w-2 h-2 rounded-full bg-black"></div>
           <input type="range" min="1" max="50" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-emerald-600" />
           <span className="text-xs w-6 text-right font-mono">{size}</span>
        </div>
        <div className="flex-1" />
        <button onClick={download} className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-gray-50 border rounded text-gray-700 text-sm shadow-sm transition-all active:scale-95">
          <Download size={14} /> Save
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-gray-400 p-8 flex justify-center items-start shadow-inner">
         <canvas ref={canvasRef} width={800} height={600} className="bg-white shadow-2xl cursor-crosshair" />
      </div>
    </div>
  );
};

const CodeEditorApp: React.FC = () => {
  const defaultCode = `// Hello World in C#
using System;

namespace ImikuApp {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("Hello World!");
            Console.WriteLine("Welcome to iMikufans OS");
        }
    }
}`;
  const [code, setCode] = useState(defaultCode);

  const renderCode = () => {
    return code.split(/(\n)/).map((line, i) => (
       <div key={i} className="whitespace-pre">{line.split(/(\s+)/).map((token, j) => {
        let className = 'text-gray-300';
        if (['using', 'namespace', 'class', 'static', 'void', 'string'].includes(token.trim())) className = 'text-[#569cd6] font-bold';
        else if (token.trim().startsWith('"') || token.trim().endsWith('"')) className = 'text-[#ce9178]';
        else if (token.trim().startsWith('//')) className = 'text-[#6a9955] italic';
        else if (['Program', 'Console', 'ImikuApp'].includes(token.trim())) className = 'text-[#4ec9b0]';
        return <span key={j} className={className}>{token}</span>;
       })}</div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm">
      <div className="bg-[#2d2d2d] text-gray-400 text-xs px-3 py-2 flex justify-between border-b border-[#3e3e3e]">
        <div className="flex gap-2">
           <span className="bg-[#1e1e1e] px-2 py-0.5 rounded text-white">Program.cs</span>
        </div>
        <span>C#</span>
      </div>
      <div className="relative flex-1 overflow-auto">
        <textarea 
          className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none p-4 z-10 focus:outline-none font-mono leading-relaxed"
          value={code}
          spellCheck={false}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="absolute inset-0 w-full h-full p-4 pointer-events-none z-0 leading-relaxed font-mono">
           {renderCode()}
        </div>
      </div>
      <div className="h-6 bg-[#007acc] text-white text-xs flex items-center px-2 justify-between">
         <span>Ready</span>
         <span>Ln {code.split('\n').length}, Col 1</span>
      </div>
    </div>
  );
};

const SettingsApp: React.FC = () => {
  const [wp, setWp] = useState(localStorage.getItem('imiku_wallpaper') || WALLPAPER_DEFAULT);

  const save = () => {
    localStorage.setItem('imiku_wallpaper', wp);
    window.location.reload();
  };

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-8 border-b pb-4 flex items-center gap-3">
          <Settings size={32} className="text-gray-600"/> Settings
        </h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Personalization</h3>
          <label className="block text-sm font-medium text-gray-600 mb-2">Desktop Background URL</label>
          <div className="flex gap-3 mb-2">
            <input 
              type="text" 
              value={wp} 
              onChange={(e) => setWp(e.target.value)}
              className="flex-1 border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button onClick={save} className="bg-emerald-600 text-white px-6 py-2 rounded font-medium hover:bg-emerald-700 transition-colors">Apply</button>
          </div>
          <p className="text-xs text-gray-400">Default: {WALLPAPER_DEFAULT}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <h3 className="text-lg font-medium mb-4 text-gray-800">System Information</h3>
           <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Operating System</span>
                <span className="font-medium">iMikufans Virtual Terminal</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Kernel Version</span>
                <span className="font-medium">WebReact 19.2 (Stable)</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-gray-500">Registered User</span>
                <span className="font-medium text-emerald-600">{USERNAME}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500">Web Engine</span>
                <span className="font-medium">Chromium/Gecko Shim</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AppStoreApp: React.FC = () => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  
  const presets = [
    { name: 'Bilibili', url: 'https://www.bilibili.com' },
    { name: 'Baidu', url: 'https://www.baidu.com' },
    { name: 'Weibo', url: 'https://weibo.com' },
    { name: 'Zhihu', url: 'https://www.zhihu.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Google', url: 'https://google.com' },
  ];

  const install = (n: string, u: string) => {
    if (!n || !u) return;
    const installed = JSON.parse(localStorage.getItem('imiku_installed_apps') || '[]');
    installed.push({ id: `custom-${Date.now()}`, name: n, url: u });
    localStorage.setItem('imiku_installed_apps', JSON.stringify(installed));
    alert(`${n} has been added to your desktop.`);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-3"><ShoppingBag /> Software Manager</h1>
        <p className="opacity-80 mt-1">Discover and install web applications</p>
      </div>
      <div className="p-8 overflow-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2"><Download size={20}/> Custom Installation</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase">App Name</label>
               <input placeholder="e.g. My Site" className="border p-2 rounded w-full focus:ring-2 ring-emerald-500 outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex-[2] space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase">Web Address</label>
               <input placeholder="https://..." className="border p-2 rounded w-full focus:ring-2 ring-emerald-500 outline-none" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </div>
          <button onClick={() => install(name, url)} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Generate Desktop Shortcut
          </button>
        </div>

        <h3 className="font-bold text-lg mb-4 text-gray-800">Featured Web Apps</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {presets.map(p => (
            <div key={p.name} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all group flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-emerald-600 group-hover:bg-emerald-50 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <div className="text-center font-bold text-gray-800 mb-3">{p.name}</div>
              <button onClick={() => install(p.name, p.url)} className="w-full bg-gray-100 text-gray-700 py-1.5 rounded-md hover:bg-emerald-500 hover:text-white text-sm font-medium transition-colors">Install</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FileManagerApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex gap-1 p-2 border-b bg-gray-50 text-sm">
        <div className="flex gap-2 mr-4">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <button className="px-3 py-1 hover:bg-gray-200 rounded text-gray-700">File</button>
        <button className="px-3 py-1 hover:bg-gray-200 rounded text-gray-700">Edit</button>
        <button className="px-3 py-1 hover:bg-gray-200 rounded text-gray-700">View</button>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 px-2 bg-white border rounded">
           <Search size={14} className="text-gray-400"/>
           <span className="text-gray-400">Search</span>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-gray-50 border-r p-3 text-sm space-y-1">
           <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-100 text-blue-700 rounded font-medium"><Folder size={16}/> Home</div>
           <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded text-gray-700 ml-2 cursor-pointer"><Monitor size={16}/> Desktop</div>
           <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded text-gray-700 ml-2 cursor-pointer"><FileText size={16}/> Documents</div>
           <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded text-gray-700 ml-2 cursor-pointer"><Download size={16}/> Downloads</div>
           <div className="mt-4 pt-4 border-t border-gray-200">
             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"><Trash2 size={16}/> Trash</div>
           </div>
        </div>
        <div className="flex-1 flex flex-col">
           <div className="p-2 border-b bg-white text-sm text-gray-500 flex items-center gap-2">
             <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">home</span> /
             <span className="hover:bg-gray-100 px-1 rounded cursor-pointer font-bold text-gray-800">jiajun</span>
           </div>
           <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-4 content-start flex-1 overflow-auto bg-white">
              <div className="flex flex-col items-center p-3 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100 cursor-pointer group transition-colors">
                 <FileText size={48} className="text-gray-400 group-hover:text-blue-500 mb-2"/>
                 <span className="text-sm text-center group-hover:text-blue-700">readme.txt</span>
              </div>
           </div>
           
           <div className="h-8 border-t bg-gray-50 flex items-center px-4 text-xs text-gray-500">
              1 item selected, 2.4 KB
           </div>
        </div>
      </div>
    </div>
  );
};

const NotepadApp: React.FC = () => {
  const [text, setText] = useState('Welcome to iMikufans Virtual Terminal.\n\nType your notes here...');
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b p-1 text-sm flex gap-1 bg-gray-50">
        <button className="hover:bg-gray-200 px-3 py-1 rounded">File</button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded">Edit</button>
        <button className="hover:bg-gray-200 px-3 py-1 rounded">Format</button>
      </div>
      <textarea 
        className="flex-1 p-4 focus:outline-none resize-none font-mono text-sm leading-relaxed"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="h-6 border-t bg-gray-100 flex items-center px-2 text-xs text-gray-500 justify-end">
         UTF-8
      </div>
    </div>
  )
};

// --- App Registry ---
// Defined outside OS to prevent recreation
const APP_REGISTRY: Record<string, AppDefinition> = {
  browser: { id: 'browser', name: 'Web Browser', icon: Globe, component: BrowserApp, defaultWidth: 900, defaultHeight: 650 },
  calc: { id: 'calc', name: 'Calculator', icon: Grid, component: CalculatorApp, defaultWidth: 320, defaultHeight: 450 },
  music: { id: 'music', name: 'Music Player', icon: Disc, component: MusicPlayerApp, defaultWidth: 400, defaultHeight: 550 },
  notepad: { id: 'notepad', name: 'Text Editor', icon: Edit3, component: NotepadApp },
  paint: { id: 'paint', name: 'Drawing Board', icon: ImageIcon, component: PaintApp, defaultWidth: 850, defaultHeight: 650 },
  code: { id: 'code', name: 'Code Editor', icon: Code, component: CodeEditorApp, defaultWidth: 800, defaultHeight: 600 },
  settings: { id: 'settings', name: 'Settings', icon: Settings, component: SettingsApp },
  store: { id: 'store', name: 'App Store', icon: ShoppingBag, component: AppStoreApp, defaultWidth: 900, defaultHeight: 700 },
  files: { id: 'files', name: 'Files', icon: Folder, component: FileManagerApp },
  // Links
  email: { id: 'email', name: 'Mail', icon: Mail, component: () => null, url: 'https://outlook.live.com' },
  home: { id: 'home', name: 'iMikufans Home', icon: Smile, component: () => null, url: 'https://www.imikufans.com' },
  blog: { id: 'blog', name: 'Blog', icon: FileText, component: () => null, url: 'https://blog.imikufans.com/' },
  emoji: { id: 'emoji', name: 'Emoji Gen', icon: Smile, component: () => null, url: 'https://pjsk.imikufans.com/' },
  about: { id: 'about', name: 'About Author', icon: User, component: () => null, url: 'https://blogx.imikufans.com/about/' },
};

// --- Window Frame Component ---
// Extracted to Top Level to fix dragging state issues

interface WindowFrameProps {
  win: AppWindow;
  isActive: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

const WindowFrame = React.memo(({ win, isActive, onFocus, onClose, onMinimize, onMaximize, onMove }: WindowFrameProps) => {
  const app = APP_REGISTRY[win.appId];
  const Component = app.component;
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle Dragging via global events to prevent cursor slipping
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onMove(win.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, win.id, onMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.state === 'maximized') return;
    onFocus(win.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
  };

  if (win.state === 'minimized') return null;

  return (
    <div 
      className={`absolute flex flex-col shadow-2xl overflow-hidden bg-white transition-all duration-75
        ${win.state === 'maximized' ? 'inset-0 !top-0 !left-0 !w-full !h-[calc(100%-48px)] rounded-none' : 'rounded-lg border border-gray-600/30'}`}
      style={{
        left: win.state === 'normal' ? win.x : 0,
        top: win.state === 'normal' ? win.y : 0,
        width: win.state === 'normal' ? win.width : '100%',
        height: win.state === 'normal' ? win.height : '100%',
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-9 flex items-center justify-between px-3 select-none transition-colors
          ${isActive ? 'bg-[#2f2f2f] text-white' : 'bg-[#e0e0e0] text-gray-500'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <div className="flex items-center gap-2">
          <app.icon size={16} />
          <span className="text-sm font-medium tracking-wide">{win.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }} className={`p-1 rounded hover:bg-white/20 ${isActive ? 'hover:text-white' : 'hover:text-gray-800'}`}><Minimize2 size={14}/></button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }} className={`p-1 rounded hover:bg-white/20 ${isActive ? 'hover:text-white' : 'hover:text-gray-800'}`}><Maximize2 size={14}/></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(win.id); }} className="p-1 hover:bg-red-500 hover:text-white rounded text-red-300 transition-colors"><X size={14}/></button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Render overlay when dragging to prevent iframe capture */}
        {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
        <Component windowId={win.id} />
      </div>
    </div>
  );
});

// --- Main OS Component ---

const OS = () => {
  const [bootStep, setBootStep] = useState(0); // 0:Off, 1:Logo, 2:Login, 3:Desktop
  const [password, setPassword] = useState('');
  
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPER_DEFAULT);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  useEffect(() => {
    const storedWp = localStorage.getItem('imiku_wallpaper');
    if (storedWp) setWallpaper(storedWp);

    // Boot Sequence
    const t1 = setTimeout(() => setBootStep(1), 500); 
    const t2 = setTimeout(() => setBootStep(2), 3500); 
    
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  // Stable callbacks for WindowFrame
  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(0, ...prev.map(p => p.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, state: w.state === 'minimized' ? 'normal' : 'minimized' } : w
    ));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, state: w.state === 'maximized' ? 'normal' : 'maximized' } : w
    ));
    focusWindow(id);
  }, [focusWindow]);

  const openApp = (appId: string) => {
    setStartOpen(false);
    const app = APP_REGISTRY[appId];
    
    if (app.url) {
      window.open(app.url, '_blank');
      return;
    }

    const id = Date.now().toString();
    const newWindow: AppWindow = {
      id,
      appId,
      title: app.name,
      icon: app.icon,
      x: 50 + (windows.length % 10) * 30,
      y: 50 + (windows.length % 10) * 30,
      width: app.defaultWidth || 600,
      height: app.defaultHeight || 400,
      zIndex: (windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 0) + 1,
      state: 'normal'
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
  };

  const handleAiSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      window.open(`https://metaso.cn/?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  const handleClickIcon = (id: string) => {
    setSelectedIconId(id);
  };

  // --- Boot Screen ---
  if (bootStep === 1) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white select-none cursor-wait">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-emerald-500/50 shadow-2xl relative z-10">
             <img src={BOOT_LOGO} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-lg font-mono text-emerald-500">iMikufans OS <span className="text-gray-500 text-sm">v2.0</span></span>
        </div>
      </div>
    );
  }

  // --- Login Screen ---
  if (bootStep === 2) {
    return (
      <div 
        className="h-full w-full flex flex-col items-center justify-center bg-cover bg-center select-none"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
        <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="p-1 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mb-6 shadow-xl">
             <img src={BOOT_LOGO} alt="User" className="w-28 h-28 rounded-full border-4 border-gray-900 object-cover" />
          </div>
          <h2 className="text-3xl font-light text-white mb-8 tracking-wide text-shadow">{USERNAME}</h2>
          <div className="flex flex-col gap-3 w-64">
             <input 
               type="password" 
               placeholder="Password"
               className="w-full p-2.5 rounded-md bg-gray-900/60 border border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-center"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && setBootStep(3)}
               autoFocus
             />
             <button 
               onClick={() => setBootStep(3)}
               className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-md font-medium transition-colors shadow-lg"
             >
               Log In
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Desktop Environment ---
  return (
    <div 
      className="h-full w-full overflow-hidden relative select-none crt font-sans"
      onClick={() => { setStartOpen(false); setSelectedIconId(null); }}
    >
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      
      {/* Desktop Icons */}
      <div className="absolute inset-0 z-0 p-4 flex flex-col flex-wrap content-start gap-4 h-[calc(100%-48px)] w-full">
        {['home', 'store', 'files', 'browser', 'music', 'calc', 'paint', 'email', 'notepad', 'code', 'settings'].map(id => (
          <div 
            key={id}
            onClick={(e) => { e.stopPropagation(); handleClickIcon(id); }}
            onDoubleClick={(e) => { e.stopPropagation(); openApp(id); }}
            className={`w-24 h-28 flex flex-col items-center justify-center gap-2 rounded border border-transparent transition-all group
               ${selectedIconId === id ? 'bg-emerald-500/30 border-emerald-400/50 backdrop-blur-sm' : 'hover:bg-white/10'}`}
          >
            {React.createElement(APP_REGISTRY[id].icon, { 
              size: 42, 
              className: `drop-shadow-xl text-white transition-transform ${selectedIconId === id ? 'scale-105' : 'group-hover:scale-105'}` 
            })}
            <span className={`text-xs text-center font-medium text-white px-1 rounded line-clamp-2 leading-tight drop-shadow-md
               ${selectedIconId === id ? '' : 'bg-black/20'}`}>
              {APP_REGISTRY[id].name}
            </span>
          </div>
        ))}
        {/* Custom Installed Apps */}
        {JSON.parse(localStorage.getItem('imiku_installed_apps') || '[]').map((app: any) => (
           <div 
             key={app.id}
             onClick={(e) => { e.stopPropagation(); handleClickIcon(app.id); }}
             onDoubleClick={(e) => { e.stopPropagation(); window.open(app.url, '_blank'); }}
             className={`w-24 h-28 flex flex-col items-center justify-center gap-2 rounded border border-transparent transition-all group
                ${selectedIconId === app.id ? 'bg-emerald-500/30 border-emerald-400/50 backdrop-blur-sm' : 'hover:bg-white/10'}`}
           >
             <Globe size={42} className="drop-shadow-xl text-emerald-300 group-hover:scale-105 transition-transform" />
             <span className={`text-xs text-center font-medium text-white px-1 rounded line-clamp-2 leading-tight drop-shadow-md
                ${selectedIconId === app.id ? '' : 'bg-black/20'}`}>
               {app.name}
             </span>
           </div>
        ))}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
           {windows.map(win => (
             <WindowFrame 
               key={win.id} 
               win={win} 
               isActive={activeWindowId === win.id}
               onFocus={focusWindow}
               onClose={closeWindow}
               onMinimize={toggleMinimize}
               onMaximize={toggleMaximize}
               onMove={moveWindow}
             />
           ))}
        </div>
      </div>

      {/* Start Menu */}
      {startOpen && (
        <div 
          className="absolute bottom-12 left-0 w-[400px] h-[550px] bg-[#2d2d2d] text-gray-200 border border-gray-700 rounded-tr-lg shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-200 divide-y divide-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
           {/* Header */}
           <div className="h-14 flex items-center px-4 bg-[#202020] rounded-tr-lg">
             <div className="bg-gray-700 p-1.5 rounded-full mr-3"><Search size={16} className="text-gray-400" /></div>
             <input className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder-gray-500" placeholder="Type to search..." autoFocus />
           </div>
           
           <div className="flex-1 flex overflow-hidden">
             {/* Sidebar */}
             <div className="w-16 flex flex-col items-center py-4 gap-2 bg-[#202020]">
                <button className="p-3 hover:bg-emerald-600 rounded-md transition-colors" title="Favorites"><StarIcon /></button>
                <button className="p-3 hover:bg-emerald-600 rounded-md transition-colors" title="Internet"><Globe size={20}/></button>
                <button className="p-3 hover:bg-emerald-600 rounded-md transition-colors" title="Store"><ShoppingBag size={20}/></button>
                <div className="flex-1"></div>
                <button onClick={() => openApp('settings')} className="p-3 hover:bg-emerald-600 rounded-md transition-colors" title="Settings"><Settings size={20}/></button>
             </div>
             
             {/* App List */}
             <div className="flex-1 p-2 overflow-y-auto bg-[#2d2d2d] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
               <div className="text-xs font-bold text-gray-500 uppercase my-2 px-3">All Applications</div>
               <div className="space-y-0.5">
                 {Object.values(APP_REGISTRY).map(app => (
                   <div 
                     key={app.id} 
                     className="flex items-center gap-3 p-2 px-3 hover:bg-emerald-600 rounded cursor-pointer group transition-colors"
                     onClick={() => openApp(app.id)}
                   >
                     {React.createElement(app.icon, { size: 20, className: "text-gray-400 group-hover:text-white" })}
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-300 group-hover:text-white">{app.name}</span>
                       <span className="text-[10px] text-gray-500 group-hover:text-emerald-200">{app.url ? 'Web Link' : 'Application'}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           {/* Footer */}
           <div className="h-14 bg-[#1a1a1a] flex items-center justify-between px-4">
              <div className="flex items-center gap-3 hover:bg-white/5 p-1 rounded pr-3 cursor-pointer">
                 <img src={BOOT_LOGO} className="w-9 h-9 rounded-full border border-emerald-500 object-cover" alt="User"/>
                 <span className="font-bold text-sm text-gray-200">{USERNAME}</span>
              </div>
              <div className="flex gap-1">
                 <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors" title="Lock Screen" onClick={() => setBootStep(2)}><User size={18}/></button>
                 <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors" title="Log Out" onClick={() => setBootStep(2)}><LogOut size={18}/></button>
                 <div className="w-px h-8 bg-gray-700 mx-1 self-center"></div>
                 <button onClick={() => setBootStep(0)} className="p-2 hover:bg-red-600 rounded text-gray-400 hover:text-white transition-colors" title="Shut Down"><Power size={18}/></button>
              </div>
           </div>
        </div>
      )}

      {/* Taskbar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a1a] border-t border-gray-700/50 z-50 flex items-center px-1 gap-1 text-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Start Button */}
        <button 
          onClick={() => setStartOpen(!startOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 mx-1 rounded hover:bg-white/10 transition-colors group ${startOpen ? 'bg-white/10 text-emerald-400' : ''}`}
        >
          <img src={BOOT_LOGO} className="w-6 h-6 rounded-full group-hover:grayscale-0 transition-all grayscale" />
          <span className="font-bold text-sm hidden md:block">Menu</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-700 mx-1"></div>

        {/* Quick Launch & Windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar mask-image-right">
          <button onClick={() => openApp('browser')} className="p-2 hover:bg-white/10 rounded group relative">
            <Globe size={20} className="text-blue-400 group-hover:scale-110 transition-transform"/>
          </button>
          <button onClick={() => openApp('files')} className="p-2 hover:bg-white/10 rounded group relative">
            <Folder size={20} className="text-yellow-400 group-hover:scale-110 transition-transform"/>
          </button>
          
          <div className="w-px h-6 bg-gray-700 mx-2"></div>

          {windows.map(win => (
            <div 
              key={win.id}
              onClick={() => win.state === 'minimized' || activeWindowId !== win.id ? focusWindow(win.id) : toggleMinimize(win.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer min-w-[140px] max-w-[200px] border-b-2 transition-all select-none
                ${activeWindowId === win.id && win.state !== 'minimized' 
                  ? 'bg-white/10 border-emerald-500 text-white shadow-inner' 
                  : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-gray-300'}`}
            >
              <win.icon size={16} className={activeWindowId === win.id ? 'text-emerald-400' : ''} />
              <span className="text-xs truncate font-medium">{win.title}</span>
            </div>
          ))}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 px-2">
            <div className="hidden md:flex items-center bg-gray-800 rounded px-2 py-1 border border-gray-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 w-48 transition-all">
            <Cpu size={14} className="text-emerald-500 mr-2" />
            <input 
                className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-gray-500" 
                placeholder="Ask AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleAiSearch}
            />
            </div>
            
            <div className="flex items-center gap-3 px-2 text-xs border-l border-gray-700 pl-4 ml-2">
                <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Wifi size={16} /></div>
                <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Volume2 size={16} /></div>
                <Clock />
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icons & Components
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-end leading-none cursor-default hover:text-emerald-400 transition-colors w-16">
      <span className="font-bold text-sm">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <span className="text-[10px] text-gray-500">{time.toLocaleDateString()}</span>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<OS />);
