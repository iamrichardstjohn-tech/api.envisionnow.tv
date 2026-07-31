import React, { useRef, useEffect, useState } from 'react';

/**
 * ThirtyTwoDegreezGame
 * - Small top-down interactive environment (canvas)
 * - Keyboard (WASD/ARROWS) + touch D-pad
 * - Collect items, save progress to localStorage
 * - Call onExit() when user leaves; optional props: onCollect(itemId)
 *
 * Optional assets:
 *  - public/assets/32game/player.png
 *  - public/assets/32game/item.png
 *  - public/assets/32game/bg.jpg
 *  - public/assets/32game/collect.wav
 */

export default function ThirtyTwoDegreezGame({ onExit, onCollect }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const keys = useRef({});
  const [collected, setCollected] = useState(() => {
    try { return JSON.parse(localStorage.getItem('32deg_collected') || '[]'); } catch { return []; }
  });
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('Welcome to 32º Degreez — explore to find episode relics.');

  // world config
  const TILE = 48;
  const mapW = 14;
  const mapH = 10;
  const obstacles = useRef(new Set());
  const items = useRef([
    { id: 'ep1_clip', x: 4, y: 2 },
    { id: 'ep_art', x: 10, y: 6 },
    { id: 'secret_note', x: 7, y: 3 }
  ]);

  useEffect(() => {
    const s = new Set();
    for (let i = 0; i < mapW; i++) {
      s.add(`${i},0`); s.add(`${i},${mapH-1}`);
    }
    for (let j = 0; j < mapH; j++) {
      s.add(`0,${j}`); s.add(`${mapW-1},${j}`);
    }
    for (let i = 3; i < 11; i++) s.add(`${i},5`);
    obstacles.current = s;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // hi-dpi setup
    const DPR = window.devicePixelRatio || 1;
    canvas.width = mapW * TILE * DPR;
    canvas.height = mapH * TILE * DPR;
    canvas.style.width = `${mapW * TILE}px`;
    canvas.style.height = `${mapH * TILE}px`;
    ctx.scale(DPR, DPR);

    const player = { x: 2 * TILE + TILE/2, y: 2 * TILE + TILE/2, size: TILE * 0.6, speed: 160 };

    const imgPlayer = new Image(); imgPlayer.src = '/assets/32game/player.png';
    const imgItem = new Image(); imgItem.src = '/assets/32game/item.png';
    const bg = new Image(); bg.src = '/assets/32game/bg.jpg';

    let last = performance.now();

    function drawGrid() {
      ctx.fillStyle = '#0b0c0d';
      ctx.fillRect(0,0,mapW*TILE,mapH*TILE);
      if (bg.complete) {
        for (let y = 0; y < mapH; y++) {
          for (let x = 0; x < mapW; x++) {
            ctx.drawImage(bg, x*TILE, y*TILE, TILE, TILE);
          }
        }
      } else {
        ctx.fillStyle = '#111';
        ctx.fillRect(0,0,mapW*TILE,mapH*TILE);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      for (let i = 0; i <= mapW; i++) {
        ctx.beginPath(); ctx.moveTo(i*TILE,0); ctx.lineTo(i*TILE,mapH*TILE); ctx.stroke();
      }
      for (let j = 0; j <= mapH; j++) {
        ctx.beginPath(); ctx.moveTo(0,j*TILE); ctx.lineTo(mapW*TILE,j*TILE); ctx.stroke();
      }
      ctx.fillStyle = '#222';
      obstacles.current.forEach(k => {
        const [ox, oy] = k.split(',').map(Number);
        ctx.fillRect(ox*TILE, oy*TILE, TILE, TILE);
      });
    }

    function drawItems() {
      items.current.forEach(it => {
        if (collected.includes(it.id)) return;
        if (imgItem.complete) {
          ctx.drawImage(imgItem, it.x*TILE + TILE*0.12, it.y*TILE + TILE*0.12, TILE*0.75, TILE*0.75);
        } else {
          ctx.fillStyle = '#e6b85c';
          ctx.beginPath();
          ctx.arc(it.x*TILE + TILE/2, it.y*TILE + TILE/2, TILE*0.22, 0, Math.PI*2);
          ctx.fill();
        }
      });
    }

    function drawPlayer() {
      if (imgPlayer.complete) {
        ctx.save();
        ctx.translate(player.x - player.size/2, player.y - player.size/2);
        ctx.drawImage(imgPlayer, 0, 0, player.size, player.size);
        ctx.restore();
      } else {
        ctx.fillStyle = '#1e90ff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size/2, 0, Math.PI*2);
        ctx.fill();
      }
    }

    function collideWithObstacles(nx, ny) {
      const tx = Math.floor(nx / TILE);
      const ty = Math.floor(ny / TILE);
      if (tx < 0 || tx >= mapW || ty < 0 || ty >= mapH) return true;
      return obstacles.current.has(`${tx},${ty}`);
    }

    function checkItemPickup() {
      let picked = null;
      items.current.forEach(it => {
        if (collected.includes(it.id)) return;
        const cx = it.x*TILE + TILE/2;
        const cy = it.y*TILE + TILE/2;
        const dist = Math.hypot(player.x - cx, player.y - cy);
        if (dist < TILE*0.9) picked = it;
      });
      if (picked) {
        const next = [...collected, picked.id];
        setCollected(next);
        localStorage.setItem('32deg_collected', JSON.stringify(next));
        setMessage(`Collected: ${picked.id}`);
        if (onCollect) onCollect(picked.id);
        const a = new Audio('/assets/32game/collect.wav');
        a.play().catch(()=>{});
        setTimeout(() => setMessage('Keep exploring...'), 2500);
      }
    }

    function update(dt) {
      if (paused) return;
      let vx = 0, vy = 0;
      if (keys.current.ArrowUp || keys.current.w) vy -= 1;
      if (keys.current.ArrowDown || keys.current.s) vy += 1;
      if (keys.current.ArrowLeft || keys.current.a) vx -= 1;
      if (keys.current.ArrowRight || keys.current.d) vx += 1;
      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy);
        vx = (vx/len) * player.speed * dt;
        vy = (vy/len) * player.speed * dt;
      }
      const nx = player.x + vx;
      const ny = player.y + vy;
      if (!collideWithObstacles(nx - player.size/2, player.y)) player.x = nx;
      if (!collideWithObstacles(player.x, ny - player.size/2)) player.y = ny;
      checkItemPickup();
    }

    function render(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0,0,mapW*TILE,mapH*TILE);
      drawGrid();
      drawItems();
      drawPlayer();
      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(8,8,240,56);
      ctx.fillStyle = '#fff';
      ctx.font = '14px system-ui, Arial';
      ctx.fillText(`32º Degreez Game`, 18, 28);
      ctx.fillStyle = '#e6b85c';
      ctx.fillText(`Collected: ${collected.length}/${items.current.length}`, 18, 48);
      // message area
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(260,8,420,46);
      ctx.fillStyle = '#fff';
      ctx.fillText(message, 270, 36);

      update(dt);
      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animRef.current);
  }, [collected, paused, onCollect]); // eslint-disable-line

  // keyboard
  useEffect(() => {
    function down(e) { keys.current[e.key] = true; }
    function up(e) { keys.current[e.key] = false; }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const dPadStyle = { width: 56, height: 56, borderRadius: 8, background: 'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.06)', fontSize:18, cursor:'pointer' };

  function renderTouchControls() {
    return (
      <div style={{position:'absolute', left:12, bottom:12, display:'flex', gap:8, zIndex:4000}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,56px)', gridTemplateRows:'repeat(3,56px)', gap:6}}>
          <div />
          <button aria-label="Up" onPointerDown={() => keys.current.w = true} onPointerUp={() => keys.current.w = false} onPointerLeave={() => keys.current.w = false} style={dPadStyle}>↑</button>
          <div />
          <button aria-label="Left" onPointerDown={() => keys.current.a = true} onPointerUp={() => keys.current.a = false} onPointerLeave={() => keys.current.a = false} style={dPadStyle}>←</button>
          <div style={{width:56,height:56}} />
          <button aria-label="Right" onPointerDown={() => keys.current.d = true} onPointerUp={() => keys.current.d = false} onPointerLeave={() => keys.current.d = false} style={dPadStyle}>→</button>
          <div />
          <button aria-label="Down" onPointerDown={() => keys.current.s = true} onPointerUp={() => keys.current.s = false} onPointerLeave={() => keys.current.s = false} style={dPadStyle}>↓</button>
          <div />
        </div>
      </div>
    );
  }

  return (
    <div style={{position:'relative', maxWidth: mapW*TILE, margin: '1rem auto', textAlign:'center'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <div style={{color:'#fff'}}><b>32º Degreez Interactive</b> — Mini-Exploration</div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => setPaused(p => !p)} className="profile-btn" style={{background: paused ? '#333' : '#1e90ff'}}>{paused ? 'Resume' : 'Pause'}</button>
          <button onClick={() => { if (onExit) onExit(); }} className="logout-btn">Exit</button>
        </div>
      </div>

      <div style={{position:'relative', borderRadius:12, overflow:'hidden', display:'inline-block', background:'#000'}}>
        <canvas ref={canvasRef} style={{display:'block', touchAction:'none'}} />
        {renderTouchControls()}
      </div>

      <div style={{marginTop:12, color:'#fff', fontSize:'0.95rem'}}>
        <div>Use WASD or arrow keys to move. Find relics hidden in the environment.</div>
        <div style={{marginTop:8}}>Progress saved automatically. Items collected: <b style={{color:'#e6b85c'}}>{collected.length}</b></div>
      </div>
    </div>
  );
}