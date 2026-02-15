import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

/* ════════════════════════════════════════════════════════════════
   DOOM STEP MOTHER — Full Preset Bank + MIDI + Photorealistic UI
   ════════════════════════════════════════════════════════════════ */

// ═══ PRESET BANK ═══
const PRESETS = [
  // ── FACTORY PATCHES ──
  { name: "INIT", category: "Factory", desc: "Default init patch",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.7,osc2Wave:"square",osc2Octave:0,osc2Detune:0,osc2Level:0.5,
    noiseLevel:0,lfoRate:2,lfoWave:"triangle",lfoDepth:0,lfoTarget:"filter",
    filterCutoff:5000,filterRes:2,filterEnvAmt:0.3,hpfCutoff:0,
    attack:0.01,decay:0.3,sustain:0.6,release:0.5,reverbMix:0.15,reverbDecay:2.5,masterVol:0.7,glide:0,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,
    seqSteps:null },
  { name: "FM Bass", category: "Factory", desc: "Classic Moog cross-modulation bass",
    osc1Wave:"sine",osc1Octave:-1,osc1Level:0.9,osc2Wave:"sine",osc2Octave:0,osc2Detune:7,osc2Level:0.6,
    noiseLevel:0,lfoRate:0.3,lfoWave:"sine",lfoDepth:0.15,lfoTarget:"pitch",
    filterCutoff:800,filterRes:6,filterEnvAmt:0.7,hpfCutoff:30,
    attack:0.005,decay:0.4,sustain:0.3,release:0.25,reverbMix:0.05,reverbDecay:1.0,masterVol:0.85,glide:0.08,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Apocalyptic Voids", category: "Factory", desc: "Dark soundscape drone with HPF + reverb",
    osc1Wave:"sawtooth",osc1Octave:-1,osc1Level:0.5,osc2Wave:"sawtooth",osc2Octave:-2,osc2Detune:12,osc2Level:0.5,
    noiseLevel:0.2,lfoRate:0.15,lfoWave:"sine",lfoDepth:0.6,lfoTarget:"filter",
    filterCutoff:1200,filterRes:12,filterEnvAmt:0.1,hpfCutoff:400,
    attack:3.0,decay:2.0,sustain:0.8,release:6.0,reverbMix:0.85,reverbDecay:9.0,masterVol:0.6,glide:0.5,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:60,seqSteps:null },
  { name: "Arcana Obscura", category: "Factory", desc: "Complex modular-style texture",
    osc1Wave:"square",osc1Octave:0,osc1Level:0.6,osc2Wave:"sawtooth",osc2Octave:1,osc2Detune:-30,osc2Level:0.4,
    noiseLevel:0.08,lfoRate:3.5,lfoWave:"triangle",lfoDepth:0.45,lfoTarget:"filter",
    filterCutoff:2200,filterRes:10,filterEnvAmt:0.6,hpfCutoff:150,
    attack:0.8,decay:1.2,sustain:0.5,release:3.0,reverbMix:0.5,reverbDecay:5.0,masterVol:0.65,glide:0.3,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:90,seqSteps:null },
  { name: "Beyond The Sun", category: "Factory", desc: "Expansive cosmic texture",
    osc1Wave:"triangle",osc1Octave:0,osc1Level:0.7,osc2Wave:"sine",osc2Octave:1,osc2Detune:5,osc2Level:0.5,
    noiseLevel:0.12,lfoRate:0.4,lfoWave:"sine",lfoDepth:0.35,lfoTarget:"filter",
    filterCutoff:3500,filterRes:5,filterEnvAmt:0.4,hpfCutoff:200,
    attack:2.5,decay:1.5,sustain:0.7,release:5.0,reverbMix:0.75,reverbDecay:8.0,masterVol:0.6,glide:0.4,
    arpOn:false,arpMode:"up",arpRate:4,arpOctaves:2,seqOn:false,seqTempo:70,seqSteps:null },
  { name: "Clockworks", category: "Factory", desc: "Rhythmic sequencer-based patch",
    osc1Wave:"square",osc1Octave:0,osc1Level:0.8,osc2Wave:"square",osc2Octave:-1,osc2Detune:0,osc2Level:0.4,
    noiseLevel:0,lfoRate:8,lfoWave:"square",lfoDepth:0.3,lfoTarget:"amp",
    filterCutoff:3000,filterRes:4,filterEnvAmt:0.5,hpfCutoff:80,
    attack:0.003,decay:0.15,sustain:0.1,release:0.1,reverbMix:0.2,reverbDecay:1.5,masterVol:0.7,glide:0,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:true,seqTempo:130,
    seqSteps:[
      {note:48,active:true},{note:48,active:false},{note:60,active:true},{note:48,active:true},
      {note:55,active:true},{note:48,active:false},{note:63,active:true},{note:60,active:true},
      {note:48,active:true},{note:55,active:true},{note:48,active:false},{note:67,active:true},
      {note:60,active:true},{note:48,active:true},{note:55,active:false},{note:63,active:true}
    ]},
  { name: "DX Sequence", category: "Factory", desc: "Digital-style FM sequence",
    osc1Wave:"sine",osc1Octave:0,osc1Level:0.7,osc2Wave:"triangle",osc2Octave:1,osc2Detune:3,osc2Level:0.5,
    noiseLevel:0,lfoRate:6,lfoWave:"sine",lfoDepth:0.2,lfoTarget:"pitch",
    filterCutoff:4000,filterRes:3,filterEnvAmt:0.6,hpfCutoff:60,
    attack:0.005,decay:0.2,sustain:0.2,release:0.15,reverbMix:0.3,reverbDecay:2.0,masterVol:0.7,glide:0,
    arpOn:false,arpMode:"up",arpRate:16,arpOctaves:1,seqOn:true,seqTempo:140,
    seqSteps:[
      {note:64,active:true},{note:67,active:true},{note:71,active:true},{note:72,active:true},
      {note:71,active:true},{note:67,active:true},{note:64,active:true},{note:60,active:true},
      {note:64,active:true},{note:67,active:true},{note:72,active:true},{note:76,active:true},
      {note:72,active:false},{note:71,active:true},{note:67,active:true},{note:64,active:true}
    ]},
  { name: "Red Moon", category: "Factory", desc: "Musical melodic lead",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.8,osc2Wave:"sawtooth",osc2Octave:0,osc2Detune:8,osc2Level:0.7,
    noiseLevel:0,lfoRate:5,lfoWave:"triangle",lfoDepth:0.12,lfoTarget:"pitch",
    filterCutoff:6000,filterRes:3,filterEnvAmt:0.4,hpfCutoff:40,
    attack:0.08,decay:0.5,sustain:0.7,release:0.8,reverbMix:0.35,reverbDecay:3.0,masterVol:0.7,glide:0.12,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Switched On Brass", category: "Factory", desc: "Classic Moog brass sound",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.7,osc2Wave:"sawtooth",osc2Octave:0,osc2Detune:4,osc2Level:0.7,
    noiseLevel:0,lfoRate:0.5,lfoWave:"sine",lfoDepth:0.05,lfoTarget:"pitch",
    filterCutoff:2500,filterRes:2,filterEnvAmt:0.65,hpfCutoff:50,
    attack:0.06,decay:0.3,sustain:0.65,release:0.3,reverbMix:0.2,reverbDecay:1.8,masterVol:0.75,glide:0,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },

  // ── CLASSIC LEADS ──
  { name: "Pop Corn Lead", category: "Classic", desc: "70s monosynth lead — staccato and bright",
    osc1Wave:"square",osc1Octave:0,osc1Level:0.8,osc2Wave:"square",osc2Octave:1,osc2Detune:0,osc2Level:0.3,
    noiseLevel:0,lfoRate:0.5,lfoWave:"sine",lfoDepth:0,lfoTarget:"pitch",
    filterCutoff:8000,filterRes:1,filterEnvAmt:0.3,hpfCutoff:100,
    attack:0.003,decay:0.12,sustain:0.0,release:0.08,reverbMix:0.1,reverbDecay:0.8,masterVol:0.75,glide:0,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Gimme Gimme Gimme", category: "Classic", desc: "Iconic 70s disco lead — dark minor riff",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.85,osc2Wave:"sawtooth",osc2Octave:0,osc2Detune:6,osc2Level:0.6,
    noiseLevel:0,lfoRate:0.3,lfoWave:"sine",lfoDepth:0.04,lfoTarget:"pitch",
    filterCutoff:4500,filterRes:3,filterEnvAmt:0.4,hpfCutoff:60,
    attack:0.005,decay:0.25,sustain:0.5,release:0.2,reverbMix:0.15,reverbDecay:1.5,masterVol:0.75,glide:0.05,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Animoog Wide", category: "Classic", desc: "Fat detuned bass/lead — wide stereo",
    osc1Wave:"sawtooth",osc1Octave:-1,osc1Level:0.8,osc2Wave:"sawtooth",osc2Octave:-1,osc2Detune:18,osc2Level:0.8,
    noiseLevel:0.03,lfoRate:0.8,lfoWave:"triangle",lfoDepth:0.08,lfoTarget:"filter",
    filterCutoff:1800,filterRes:4,filterEnvAmt:0.5,hpfCutoff:25,
    attack:0.02,decay:0.6,sustain:0.7,release:0.5,reverbMix:0.25,reverbDecay:2.5,masterVol:0.8,glide:0.06,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Floyd's Machine", category: "Classic", desc: "Arpeggiated Pink Floyd-style — spacey delays",
    osc1Wave:"triangle",osc1Octave:0,osc1Level:0.7,osc2Wave:"sine",osc2Octave:1,osc2Detune:2,osc2Level:0.4,
    noiseLevel:0,lfoRate:1.5,lfoWave:"sine",lfoDepth:0.2,lfoTarget:"filter",
    filterCutoff:5000,filterRes:5,filterEnvAmt:0.5,hpfCutoff:100,
    attack:0.01,decay:0.4,sustain:0.4,release:0.8,reverbMix:0.6,reverbDecay:6.0,masterVol:0.65,glide:0,
    arpOn:true,arpMode:"up",arpRate:8,arpOctaves:2,seqOn:false,seqTempo:110,seqSteps:null },
  { name: "Aftertaste Bass", category: "Classic", desc: "Gritty modulated bass — raw and dirty",
    osc1Wave:"sawtooth",osc1Octave:-1,osc1Level:0.9,osc2Wave:"square",osc2Octave:-1,osc2Detune:-5,osc2Level:0.7,
    noiseLevel:0.05,lfoRate:4,lfoWave:"triangle",lfoDepth:0.15,lfoTarget:"filter",
    filterCutoff:600,filterRes:8,filterEnvAmt:0.8,hpfCutoff:30,
    attack:0.003,decay:0.35,sustain:0.25,release:0.2,reverbMix:0.08,reverbDecay:0.8,masterVol:0.85,glide:0.1,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },

  // ── PATCHBOOK INSPIRED ──
  { name: "Self-Gen Drone", category: "Patchbook", desc: "Self-generating evolving drone",
    osc1Wave:"sawtooth",osc1Octave:-2,osc1Level:0.6,osc2Wave:"triangle",osc2Octave:-1,osc2Detune:15,osc2Level:0.5,
    noiseLevel:0.15,lfoRate:0.08,lfoWave:"sine",lfoDepth:0.7,lfoTarget:"filter",
    filterCutoff:900,filterRes:15,filterEnvAmt:0.2,hpfCutoff:60,
    attack:4.0,decay:3.0,sustain:0.9,release:8.0,reverbMix:0.8,reverbDecay:9.5,masterVol:0.5,glide:0.8,
    arpOn:false,arpMode:"up",arpRate:4,arpOctaves:1,seqOn:false,seqTempo:60,seqSteps:null },
  { name: "Analog Classic Lead", category: "Patchbook", desc: "Warm analog lead — Anton Anru style",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.8,osc2Wave:"sawtooth",osc2Octave:0,osc2Detune:10,osc2Level:0.6,
    noiseLevel:0,lfoRate:5.5,lfoWave:"triangle",lfoDepth:0.1,lfoTarget:"pitch",
    filterCutoff:4000,filterRes:2,filterEnvAmt:0.35,hpfCutoff:40,
    attack:0.04,decay:0.4,sustain:0.65,release:0.5,reverbMix:0.25,reverbDecay:2.0,masterVol:0.75,glide:0.08,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Explorer Bass", category: "Patchbook", desc: "Deep exploratory bass — resonant sweep",
    osc1Wave:"sawtooth",osc1Octave:-1,osc1Level:0.85,osc2Wave:"sawtooth",osc2Octave:-2,osc2Detune:3,osc2Level:0.7,
    noiseLevel:0,lfoRate:0.6,lfoWave:"triangle",lfoDepth:0.25,lfoTarget:"filter",
    filterCutoff:500,filterRes:10,filterEnvAmt:0.9,hpfCutoff:20,
    attack:0.005,decay:0.5,sustain:0.2,release:0.3,reverbMix:0.1,reverbDecay:1.2,masterVol:0.85,glide:0.15,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
  { name: "Sequenced Arp", category: "Patchbook", desc: "Self-generating rhythmic arp pattern",
    osc1Wave:"square",osc1Octave:0,osc1Level:0.7,osc2Wave:"triangle",osc2Octave:1,osc2Detune:0,osc2Level:0.4,
    noiseLevel:0,lfoRate:4,lfoWave:"sine",lfoDepth:0.3,lfoTarget:"filter",
    filterCutoff:3500,filterRes:6,filterEnvAmt:0.5,hpfCutoff:80,
    attack:0.005,decay:0.2,sustain:0.15,release:0.15,reverbMix:0.35,reverbDecay:3.5,masterVol:0.7,glide:0,
    arpOn:true,arpMode:"updown",arpRate:12,arpOctaves:2,seqOn:false,seqTempo:125,seqSteps:null },
  { name: "Acid Squelch", category: "Patchbook", desc: "303-style acid line — high resonance",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.9,osc2Wave:"square",osc2Octave:0,osc2Detune:0,osc2Level:0,
    noiseLevel:0,lfoRate:0.3,lfoWave:"sine",lfoDepth:0,lfoTarget:"filter",
    filterCutoff:400,filterRes:18,filterEnvAmt:0.95,hpfCutoff:30,
    attack:0.003,decay:0.18,sustain:0.0,release:0.08,reverbMix:0.15,reverbDecay:1.5,masterVol:0.8,glide:0.06,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:true,seqTempo:138,
    seqSteps:[
      {note:48,active:true},{note:48,active:true},{note:60,active:true},{note:48,active:false},
      {note:51,active:true},{note:48,active:true},{note:60,active:true},{note:55,active:true},
      {note:48,active:true},{note:48,active:false},{note:63,active:true},{note:48,active:true},
      {note:51,active:true},{note:60,active:true},{note:48,active:true},{note:55,active:true}
    ]},
  { name: "Dark Pad", category: "Patchbook", desc: "Lush evolving dark pad",
    osc1Wave:"sawtooth",osc1Octave:0,osc1Level:0.5,osc2Wave:"triangle",osc2Octave:-1,osc2Detune:8,osc2Level:0.5,
    noiseLevel:0.06,lfoRate:0.3,lfoWave:"sine",lfoDepth:0.2,lfoTarget:"filter",
    filterCutoff:2000,filterRes:3,filterEnvAmt:0.25,hpfCutoff:80,
    attack:1.5,decay:2.0,sustain:0.8,release:4.0,reverbMix:0.6,reverbDecay:7.0,masterVol:0.6,glide:0.3,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:80,seqSteps:null },
  { name: "Perc Pluck", category: "Patchbook", desc: "Short percussive pluck",
    osc1Wave:"triangle",osc1Octave:0,osc1Level:0.9,osc2Wave:"sine",osc2Octave:1,osc2Detune:0,osc2Level:0.5,
    noiseLevel:0.1,lfoRate:0.5,lfoWave:"sine",lfoDepth:0,lfoTarget:"filter",
    filterCutoff:6000,filterRes:2,filterEnvAmt:0.8,hpfCutoff:60,
    attack:0.001,decay:0.15,sustain:0.0,release:0.1,reverbMix:0.3,reverbDecay:2.5,masterVol:0.75,glide:0,
    arpOn:false,arpMode:"up",arpRate:8,arpOctaves:1,seqOn:false,seqTempo:120,seqSteps:null },
];

const DEFAULT_CC_MAP = {
  1:{param:"lfoDepth",label:"Mod Wheel→LFO"},7:{param:"masterVol",label:"Volume"},71:{param:"filterRes",label:"Res"},
  74:{param:"filterCutoff",label:"Cutoff"},73:{param:"attack",label:"Atk"},75:{param:"decay",label:"Dec"},
  79:{param:"sustain",label:"Sus"},72:{param:"release",label:"Rel"},76:{param:"lfoRate",label:"LFO Rate"},
  91:{param:"reverbMix",label:"Rev Mix"},5:{param:"glide",label:"Glide"},77:{param:"hpfCutoff",label:"HPF"},
  78:{param:"filterEnvAmt",label:"Filt Env"},16:{param:"osc1Level",label:"Osc1"},17:{param:"osc2Level",label:"Osc2"},
  18:{param:"noiseLevel",label:"Noise"},19:{param:"osc2Detune",label:"Detune"},
};
const PARAM_RANGES = {
  lfoDepth:[0,1],masterVol:[0,1],filterCutoff:[20,20000],filterRes:[0,20],attack:[0.001,4],decay:[0.01,4],
  sustain:[0,1],release:[0.01,8],lfoRate:[0.1,30],reverbMix:[0,1],glide:[0,1],hpfCutoff:[0,2000],
  filterEnvAmt:[0,1],osc1Level:[0,1],osc2Level:[0,1],noiseLevel:[0,0.5],osc2Detune:[-100,100],reverbDecay:[0.1,10],
};

// ─── UI COMPONENTS ───
const Knob = ({ value, onChange, min=0, max=1, label, size=52, cream=true, numbered=false, steps=null, paramId, midiLearn, onMidiLearn }) => {
  const dragRef = useRef({ active:false, startY:0, startVal:0 });
  const norm = (value - min) / (max - min);
  const angle = -135 + norm * 270;
  const isLearning = midiLearn === paramId;
  const handleMouseDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    dragRef.current = { active:true, startY:e.clientY, startVal:value };
    const onMove = (ev) => { if (!dragRef.current.active) return; const d = (dragRef.current.startY - ev.clientY) / 200; let nv = dragRef.current.startVal + d * (max - min); nv = Math.max(min, Math.min(max, nv)); if (steps) nv = Math.round(nv / steps) * steps; onChange(nv); };
    const onUp = () => { dragRef.current.active = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };
  const handleRightClick = (e) => { e.preventDefault(); if (onMidiLearn && paramId) onMidiLearn(paramId); };
  const kc = cream ? "#e8dcc8" : "#1a1a1a"; const hc = cream ? "rgba(255,255,240,0.6)" : "rgba(255,255,255,0.1)";
  const sc = cream ? "rgba(140,130,110,0.8)" : "rgba(0,0,0,0.8)"; const ec = cream ? "#d4c8b0" : "#333"; const lc = cream ? "#222" : "#ccc";
  const ticks = []; if (numbered) { for (let i=0;i<11;i++) { const ta=-135+(i/10)*270; const r2=(ta-90)*Math.PI/180; const r=size/2+7; ticks.push({x:size/2+8+Math.cos(r2)*r,y:size/2+8+Math.sin(r2)*r}); } }
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,userSelect:"none"}}>
      {label && <span style={{fontSize:Math.max(7,size*0.14),color:cream?"#ddd":"#999",textTransform:"uppercase",letterSpacing:1.2,textAlign:"center",lineHeight:1,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontWeight:500,maxWidth:size+30,textShadow:"0 1px 2px rgba(0,0,0,0.8)"}}>{label}</span>}
      <div style={{position:"relative",width:size+16,height:size+16,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {ticks.map((t,i) => <div key={i} style={{position:"absolute",left:t.x,top:t.y,width:3,height:3,borderRadius:"50%",background:"#888",transform:"translate(-50%,-50%)"}} />)}
        <div onMouseDown={handleMouseDown} onContextMenu={handleRightClick} style={{
          width:size,height:size,borderRadius:"50%",
          background:`radial-gradient(ellipse at 38% 32%, ${hc}, ${kc} 45%, ${ec} 85%, ${sc} 100%)`,
          boxShadow:`0 3px 10px rgba(0,0,0,0.5),0 1px 3px rgba(0,0,0,0.3),inset 0 1px 2px ${cream?"rgba(255,255,240,0.4)":"rgba(255,255,255,0.08)"},inset 0 -2px 4px rgba(0,0,0,0.15)`,
          cursor:"grab",position:"relative",border:isLearning?"2px solid #ff0066":`1px solid ${cream?"#c8bca0":"#444"}`,
          animation:isLearning?"pulse 0.6s ease-in-out infinite":"none",
        }}>
          <div style={{position:"absolute",top:"50%",left:"50%",width:2.5,height:size/2-2,backgroundColor:lc,transformOrigin:"top center",transform:`translate(-50%,0) rotate(${angle}deg)`,borderRadius:1.5}}>
            <div style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",backgroundColor:lc}} />
          </div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size*0.22,height:size*0.22,borderRadius:"50%",background:cream?"radial-gradient(circle at 40% 35%,#f0e8d8,#d8ccb4)":"radial-gradient(circle at 40% 35%,#444,#1a1a1a)",boxShadow:"inset 0 1px 2px rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.3)"}} />
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({value,options,onChange,label}) => {
  const idx=options.indexOf(value); const n=options.length; const h=n<=2?28:n<=3?34:40; const pos=idx/(n-1)*(h-14)+2;
  return (<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
    {label && <span style={{fontSize:6.5,color:"#bbb",textTransform:"uppercase",letterSpacing:0.8,fontFamily:"'Helvetica Neue',sans-serif",fontWeight:500,textShadow:"0 1px 1px rgba(0,0,0,0.8)"}}>{label}</span>}
    <div onClick={()=>onChange(options[(idx+1)%n])} style={{width:14,height:h,borderRadius:7,background:"linear-gradient(180deg,#3a3a3a,#1a1a1a,#3a3a3a)",border:"1px solid #555",cursor:"pointer",position:"relative",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.6)"}}>
      <div style={{position:"absolute",left:1,right:1,height:11,borderRadius:5,top:pos,background:"linear-gradient(180deg,#d0d0d0,#aaa,#888)",boxShadow:"0 1px 3px rgba(0,0,0,0.4),inset 0 1px 1px rgba(255,255,255,0.5)",transition:"top 0.1s ease"}} />
    </div></div>);
};
const IllumButton = ({active,onClick,color="#ff6622",size=22}) => (<div onClick={onClick} style={{width:size,height:size,borderRadius:3,cursor:"pointer",background:active?`linear-gradient(135deg,${color}ee,${color})`:"linear-gradient(135deg,#555,#333)",boxShadow:active?`0 0 12px ${color}88,inset 0 1px 2px rgba(255,255,255,0.3)`:"inset 0 2px 4px rgba(0,0,0,0.5)",border:`1px solid ${active?color:"#666"}`,transition:"all 0.1s ease"}} />);
const PatchJack = ({label}) => (<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><span style={{fontSize:5.5,color:"#bbb",textTransform:"uppercase",letterSpacing:0.3,fontFamily:"'Helvetica Neue',sans-serif",textAlign:"center",lineHeight:1,maxWidth:32,textShadow:"0 1px 1px rgba(0,0,0,0.6)"}}>{label}</span><div style={{width:15,height:15,borderRadius:"50%",background:"radial-gradient(circle at 45% 40%,#444,#111 60%,#000 100%)",border:"2px solid #666",boxShadow:"inset 0 2px 5px rgba(0,0,0,0.9)"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#000",margin:"3px auto 0",boxShadow:"inset 0 1px 2px rgba(0,0,0,1)"}} /></div></div>);
const Panel = ({color,children,style:s}) => (<div style={{background:`linear-gradient(175deg,${color}ee,${color}cc 50%,${color}aa)`,borderRadius:2,padding:"5px 6px 6px",position:"relative",overflow:"hidden",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.3)",...s}}><div style={{position:"absolute",inset:0,opacity:0.05,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(255,255,255,0.1) 1px,transparent 2px)"}} />{children}</div>);
const SectionLabel = ({children,dark=false}) => (<div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:2.5,textAlign:"center",marginBottom:4,color:dark?"#ccc":"#111",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",textShadow:dark?"0 1px 2px rgba(0,0,0,0.8)":"0 1px 0 rgba(255,255,255,0.3)"}}>{children}</div>);
const WoodCheek = ({side}) => (<div style={{width:24,minHeight:"100%",background:`linear-gradient(${side==="left"?"90deg":"270deg"},#2a1a0a,#3d2510 30%,#4a2e15 50%,#3d2510 70%,#2a1a0a)`,borderRadius:side==="left"?"6px 0 0 6px":"0 6px 6px 0",boxShadow:side==="left"?"inset -2px 0 6px rgba(0,0,0,0.3)":"inset 2px 0 6px rgba(0,0,0,0.3)",position:"relative",overflow:"hidden"}}>{Array(25).fill(0).map((_,i)=><div key={i} style={{position:"absolute",left:0,right:0,top:i*16+Math.sin(i*0.7)*4,height:1,background:`rgba(${60+i*3},${30+i*2},${10+i},${0.12+(i%3)*0.04})`}} />)}</div>);

// ═══ MAIN ═══
export default function DOOMStepMother() {
  const audioRef = useRef(null); const arpEventRef = useRef(null); const seqEventRef = useRef(null);
  const midiRef = useRef({access:null,input:null,clockCount:0,clockTimes:[]});
  const [started,setStarted] = useState(false);
  const [activeNotes,setActiveNotes] = useState(new Set());
  const [midiDevices,setMidiDevices] = useState([]); const [midiDeviceId,setMidiDeviceId] = useState("");
  const [midiConnected,setMidiConnected] = useState(false); const [midiActivity,setMidiActivity] = useState(null);
  const [midiLearnTarget,setMidiLearnTarget] = useState(null); const [ccMap,setCcMap] = useState(DEFAULT_CC_MAP);
  const [midiClockSync,setMidiClockSync] = useState(false); const [lastMidiMsg,setLastMidiMsg] = useState("");
  const [showMidiPanel,setShowMidiPanel] = useState(false); const [pitchBend,setPitchBend] = useState(0);
  const [currentPreset,setCurrentPreset] = useState(0); const [presetCategory,setPresetCategory] = useState("All");

  const [osc1Wave,setOsc1Wave]=useState("sawtooth"); const [osc1Octave,setOsc1Octave]=useState(0); const [osc1Level,setOsc1Level]=useState(0.7);
  const [osc2Wave,setOsc2Wave]=useState("square"); const [osc2Octave,setOsc2Octave]=useState(0); const [osc2Detune,setOsc2Detune]=useState(0); const [osc2Level,setOsc2Level]=useState(0.5);
  const [noiseLevel,setNoiseLevel]=useState(0); const [lfoRate,setLfoRate]=useState(2); const [lfoWave,setLfoWave]=useState("triangle");
  const [lfoDepth,setLfoDepth]=useState(0); const [lfoTarget,setLfoTarget]=useState("filter");
  const [filterCutoff,setFilterCutoff]=useState(5000); const [filterRes,setFilterRes]=useState(2);
  const [filterEnvAmt,setFilterEnvAmt]=useState(0.3); const [hpfCutoff,setHpfCutoff]=useState(0);
  const [attack,setAttack]=useState(0.01); const [decay,setDecay]=useState(0.3); const [sustain,setSustain]=useState(0.6); const [release,setRelease]=useState(0.5);
  const [reverbMix,setReverbMix]=useState(0.15); const [reverbDecay,setReverbDecay]=useState(2.5);
  const [masterVol,setMasterVol]=useState(0.7); const [glide,setGlide]=useState(0);
  const [arpOn,setArpOn]=useState(false); const [arpMode,setArpMode]=useState("up"); const [arpRate,setArpRate]=useState(8); const [arpOctaves,setArpOctaves]=useState(1);
  const [seqOn,setSeqOn]=useState(false); const [seqSteps,setSeqSteps]=useState(Array(16).fill({note:60,active:true}));
  const [seqLength]=useState(16); const [seqCurrentStep,setSeqCurrentStep]=useState(-1); const [seqTempo,setSeqTempo]=useState(120);
  const [keyboardOctave,setKeyboardOctave]=useState(3);
  const heldNotesRef = useRef([]);
  const arpReleaseIdsRef = useRef(new Set());
  const seqReleaseIdsRef = useRef(new Set());
  const noteResetIdsRef = useRef(new Set());
  const [legatoMode] = useState(true);

  const paramSetters = useRef({});
  paramSetters.current = { lfoDepth:setLfoDepth,masterVol:setMasterVol,filterCutoff:setFilterCutoff,filterRes:setFilterRes,attack:setAttack,decay:setDecay,sustain:setSustain,release:setRelease,lfoRate:setLfoRate,reverbMix:setReverbMix,glide:setGlide,hpfCutoff:setHpfCutoff,filterEnvAmt:setFilterEnvAmt,osc1Level:setOsc1Level,osc2Level:setOsc2Level,noiseLevel:setNoiseLevel,osc2Detune:setOsc2Detune,reverbDecay:setReverbDecay };

  const noteNames=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const midiToFreq=(m)=>440*Math.pow(2,(m-69)/12);
  const midiToNote=(m)=>noteNames[m%12]+Math.floor(m/12-1);

  // ═══ LOAD PRESET ═══
  const loadPreset = useCallback((idx) => {
    const p = PRESETS[idx]; if (!p) return;
    setCurrentPreset(idx);
    setOsc1Wave(p.osc1Wave); setOsc1Octave(p.osc1Octave); setOsc1Level(p.osc1Level);
    setOsc2Wave(p.osc2Wave); setOsc2Octave(p.osc2Octave); setOsc2Detune(p.osc2Detune); setOsc2Level(p.osc2Level);
    setNoiseLevel(p.noiseLevel); setLfoRate(p.lfoRate); setLfoWave(p.lfoWave); setLfoDepth(p.lfoDepth); setLfoTarget(p.lfoTarget);
    setFilterCutoff(p.filterCutoff); setFilterRes(p.filterRes); setFilterEnvAmt(p.filterEnvAmt); setHpfCutoff(p.hpfCutoff);
    setAttack(p.attack); setDecay(p.decay); setSustain(p.sustain); setRelease(p.release);
    setReverbMix(p.reverbMix); setReverbDecay(p.reverbDecay); setMasterVol(p.masterVol); setGlide(p.glide);
    setArpOn(p.arpOn); setArpMode(p.arpMode); setArpRate(p.arpRate); setArpOctaves(p.arpOctaves);
    setSeqOn(p.seqOn); setSeqTempo(p.seqTempo);
    if (p.seqSteps) setSeqSteps(p.seqSteps);
    else setSeqSteps(Array(16).fill({note:60,active:true}));
    if (audioRef.current) { audioRef.current.reverb.decay = p.reverbDecay; }
  }, []);

  // ═══ AUDIO ═══
  const initAudio = async () => {
    await Tone.start();
    const osc1=new Tone.Oscillator({type:"sawtooth",frequency:440}).start();
    const osc2=new Tone.Oscillator({type:"square",frequency:440}).start();
    const noise=new Tone.Noise("white").start();
    const osc1Gain=new Tone.Gain(0);const osc2Gain=new Tone.Gain(0);const noiseGain=new Tone.Gain(0);
    const mixer=new Tone.Gain(1);
    osc1.connect(osc1Gain);osc2.connect(osc2Gain);noise.connect(noiseGain);
    osc1Gain.connect(mixer);osc2Gain.connect(mixer);noiseGain.connect(mixer);
    const hpf=new Tone.Filter({type:"highpass",frequency:20,rolloff:-12});
    const lpf=new Tone.Filter({type:"lowpass",frequency:5000,rolloff:-24,Q:2});
    const env=new Tone.AmplitudeEnvelope({attack:0.01,decay:0.3,sustain:0.6,release:0.5});
    const filterEnv=new Tone.FrequencyEnvelope({attack:0.01,decay:0.3,sustain:0.4,release:0.5,baseFrequency:200,octaves:4,exponent:2});
    filterEnv.connect(lpf.frequency);
    const lfo=new Tone.LFO({frequency:2,type:"triangle",min:-1,max:1}).start();
    const lfoGain=new Tone.Gain(0);lfo.connect(lfoGain);
    const reverb=new Tone.Reverb({decay:2.5,wet:0.15});await reverb.generate();
    const master=new Tone.Gain(0.7);
    mixer.connect(hpf);hpf.connect(lpf);lpf.connect(env);env.connect(reverb);reverb.connect(master);master.toDestination();
    Tone.Transport.bpm.value=seqTempo;Tone.Transport.start();
    audioRef.current={osc1,osc2,noise,osc1Gain,osc2Gain,noiseGain,mixer,hpf,lpf,env,filterEnv,lfo,lfoGain,reverb,master,currentNote:null,arpNotes:[],pitchBendSemitones:0};
    setStarted(true);
  };

  const clearScheduledReleaseIds = useCallback((idsRef)=>{
    idsRef.current.forEach(id=>Tone.Transport.clear(id));
    idsRef.current.clear();
  },[]);

  const registerHeldNote = useCallback((midi)=>{
    heldNotesRef.current = [...heldNotesRef.current.filter(n=>n!==midi),midi];
  },[]);

  const unregisterHeldNote = useCallback((midi)=>{
    heldNotesRef.current = heldNotesRef.current.filter(n=>n!==midi);
    return heldNotesRef.current;
  },[]);

  const playNote = useCallback((midi,velocity=1,time=Tone.now())=>{
    if(!audioRef.current)return;const a=audioRef.current;const bo=a.pitchBendSemitones||0;const freq=midiToFreq(midi+bo);const vs=0.3+velocity*0.7;
    if(glide>0&&a.currentNote!==null){a.osc1.frequency.setValueAtTime(a.osc1.frequency.value,time);a.osc2.frequency.setValueAtTime(a.osc2.frequency.value,time);a.osc1.frequency.linearRampToValueAtTime(freq*Math.pow(2,osc1Octave),time+glide);a.osc2.frequency.linearRampToValueAtTime(freq*Math.pow(2,osc2Octave),time+glide);}
    else{a.osc1.frequency.setValueAtTime(freq*Math.pow(2,osc1Octave),time);a.osc2.frequency.setValueAtTime(freq*Math.pow(2,osc2Octave),time);}
    a.osc1Gain.gain.setValueAtTime(osc1Level*vs,time);a.osc2Gain.gain.setValueAtTime(osc2Level*vs,time);a.noiseGain.gain.setValueAtTime(noiseLevel*vs,time);
    const isLegato = legatoMode && a.currentNote!==null;
    if(!isLegato){a.env.triggerAttack(time);a.filterEnv.triggerAttack(time);}
    a.currentNote=midi;
  },[osc1Octave,osc2Octave,osc1Level,osc2Level,noiseLevel,glide,legatoMode]);

  const releaseNote = useCallback((midi,time=Tone.now())=>{
    if(!audioRef.current)return;const a=audioRef.current;
    if(a.currentNote!==midi)return;
    const held = heldNotesRef.current;
    if(held.length>0){
      const nextNote = held[held.length-1];
      playNote(nextNote,1,time);
      return;
    }
    a.env.triggerRelease(time);a.filterEnv.triggerRelease(time);
    const clearTime=time+release+0.1;
    a.osc1Gain.gain.setValueAtTime(0,clearTime);a.osc2Gain.gain.setValueAtTime(0,clearTime);a.noiseGain.gain.setValueAtTime(0,clearTime);
    const resetId = Tone.Transport.scheduleOnce(()=>{if(audioRef.current&&audioRef.current.currentNote===midi)audioRef.current.currentNote=null;noteResetIdsRef.current.delete(resetId);},clearTime);
    noteResetIdsRef.current.add(resetId);
  },[release,playNote]);

  const handlePitchBend = useCallback((bv)=>{if(!audioRef.current)return;const a=audioRef.current;const s=bv*2;a.pitchBendSemitones=s;setPitchBend(bv);if(a.currentNote!==null){const f=midiToFreq(a.currentNote+s);a.osc1.frequency.rampTo(f*Math.pow(2,osc1Octave),0.02);a.osc2.frequency.rampTo(f*Math.pow(2,osc2Octave),0.02);}},[osc1Octave,osc2Octave]);

  const handleCC = useCallback((cc,value)=>{
    const norm=value/127;
    if(midiLearnTarget){setCcMap(prev=>{const nm={...prev};Object.keys(nm).forEach(k=>{if(nm[k].param===midiLearnTarget)delete nm[k];});nm[cc]={param:midiLearnTarget,label:`CC${cc}→${midiLearnTarget}`};return nm;});setMidiLearnTarget(null);return;}
    const mapping=ccMap[cc];if(mapping&&PARAM_RANGES[mapping.param]){const[min,max]=PARAM_RANGES[mapping.param];let nv;if(mapping.param==="filterCutoff"||mapping.param==="hpfCutoff")nv=min*Math.pow(max/min,norm);else nv=min+norm*(max-min);const setter=paramSetters.current[mapping.param];if(setter)setter(nv);}
  },[midiLearnTarget,ccMap]);

  const handleMidiClock = useCallback(()=>{if(!midiClockSync)return;const m=midiRef.current;m.clockCount++;const now=performance.now();m.clockTimes.push(now);if(m.clockTimes.length>24)m.clockTimes.shift();if(m.clockTimes.length>=24){const el=m.clockTimes[m.clockTimes.length-1]-m.clockTimes[0];const bpm=(60000/el)*(m.clockTimes.length-1)/24;if(bpm>20&&bpm<300)setSeqTempo(Math.round(bpm));}},[midiClockSync]);

  // MIDI init
  useEffect(()=>{let ma=null;const init=async()=>{try{ma=await navigator.requestMIDIAccess({sysex:false});midiRef.current.access=ma;const upd=()=>{const ins=[];ma.inputs.forEach(i=>ins.push({id:i.id,name:i.name||`Input ${i.id}`,manufacturer:i.manufacturer||""}));setMidiDevices(ins);};upd();ma.onstatechange=upd;}catch(e){console.log("No MIDI:",e);}};init();return()=>{if(midiRef.current.input){midiRef.current.input.onmidimessage=null;midiRef.current.input=null;}if(ma)ma.onstatechange=null;};},[]);

  const handleMidiMessage = useCallback((e)=>{
    const[status,d1,d2]=e.data;const cmd=status&0xf0;const ch=status&0x0f;
    setMidiActivity(Date.now());setTimeout(()=>setMidiActivity(null),100);
    if(cmd===0x90&&d2>0){setLastMidiMsg(`ON:${midiToNote(d1)} v${d2}`);registerHeldNote(d1);if(arpOn&&audioRef.current)audioRef.current.arpNotes=[...new Set([...(audioRef.current.arpNotes||[]),d1])];playNote(d1,d2/127);setActiveNotes(p=>new Set([...p,d1]));}
    else if(cmd===0x80||(cmd===0x90&&d2===0)){setLastMidiMsg(`OFF:${midiToNote(d1)}`);unregisterHeldNote(d1);if(arpOn&&audioRef.current){audioRef.current.arpNotes=(audioRef.current.arpNotes||[]).filter(n=>n!==d1);if(audioRef.current.arpNotes.length===0)releaseNote(d1);}else releaseNote(d1);setActiveNotes(p=>{const n=new Set(p);n.delete(d1);return n;});}
    else if(cmd===0xb0){setLastMidiMsg(`CC${d1}:${d2}`);handleCC(d1,d2);}
    else if(cmd===0xe0){const bv=((d2<<7)|d1)/8192-1;setLastMidiMsg(`PB:${bv.toFixed(2)}`);handlePitchBend(bv);}
    else if(status===0xf8)handleMidiClock();
    else if(status===0xfa&&midiClockSync){setSeqOn(true);midiRef.current.clockCount=0;midiRef.current.clockTimes=[];}
    else if(status===0xfc&&midiClockSync)setSeqOn(false);
  },[playNote,releaseNote,handleCC,handlePitchBend,handleMidiClock,arpOn,midiClockSync,registerHeldNote,unregisterHeldNote]);

  useEffect(()=>{if(!midiRef.current.access||!midiDeviceId)return;if(midiRef.current.input){midiRef.current.input.onmidimessage=null;midiRef.current.input=null;}const inp=midiRef.current.access.inputs.get(midiDeviceId);if(inp){inp.onmidimessage=handleMidiMessage;midiRef.current.input=inp;setMidiConnected(true);}else setMidiConnected(false);},[midiDeviceId,handleMidiMessage]);

  useEffect(()=>{if(!started)return;Tone.Transport.bpm.rampTo(seqTempo,0.05);},[seqTempo,started]);

  useEffect(()=>{if(!audioRef.current)return;const a=audioRef.current;a.osc1.type=osc1Wave;a.osc2.type=osc2Wave;a.osc2.detune.value=osc2Detune;a.lpf.frequency.value=filterCutoff;a.lpf.Q.value=filterRes;a.hpf.frequency.value=hpfCutoff;a.env.attack=attack;a.env.decay=decay;a.env.sustain=sustain;a.env.release=release;a.filterEnv.attack=attack;a.filterEnv.decay=decay;a.filterEnv.sustain=sustain*0.6;a.filterEnv.release=release;a.filterEnv.octaves=filterEnvAmt*8;a.lfo.frequency.value=lfoRate;a.lfo.type=lfoWave;a.reverb.wet.value=reverbMix;a.master.gain.value=masterVol;},[osc1Wave,osc2Wave,osc2Detune,filterCutoff,filterRes,hpfCutoff,attack,decay,sustain,release,filterEnvAmt,lfoRate,lfoWave,reverbMix,masterVol]);

  useEffect(()=>{if(!audioRef.current)return;const a=audioRef.current;a.lfoGain.disconnect();a.lfoGain.gain.value=lfoDepth;if(lfoTarget==="filter"){a.lfo.min=-lfoDepth*2000;a.lfo.max=lfoDepth*2000;a.lfoGain.connect(a.lpf.frequency);}else if(lfoTarget==="pitch"){a.lfo.min=-lfoDepth*100;a.lfo.max=lfoDepth*100;a.lfoGain.connect(a.osc1.detune);a.lfoGain.connect(a.osc2.detune);}else if(lfoTarget==="amp"){a.lfo.min=1-lfoDepth;a.lfo.max=1;a.lfoGain.connect(a.master.gain);}},[lfoTarget,lfoDepth]);

  useEffect(()=>{if(arpEventRef.current!==null){Tone.Transport.clear(arpEventRef.current);arpEventRef.current=null;}clearScheduledReleaseIds(arpReleaseIdsRef);if(!audioRef.current||!arpOn||audioRef.current.arpNotes.length===0)return;let idx=0;const intervalTicks=Math.max(1,Math.round((4/arpRate)*Tone.Transport.PPQ));const intervalSeconds=(60/seqTempo)*(4/arpRate);arpEventRef.current=Tone.Transport.scheduleRepeat((time)=>{const a=audioRef.current;if(!a||a.arpNotes.length===0)return;let notes=[...new Set(a.arpNotes)].sort((x,y)=>x-y);let expanded=[];for(let o=0;o<arpOctaves;o++)expanded=expanded.concat(notes.map(n=>n+o*12));if(expanded.length===0)return;if(arpMode==="down")expanded.reverse();else if(arpMode==="updown")expanded=[...expanded,...[...expanded].reverse().slice(1,-1)];const note=arpMode==="random"?expanded[Math.floor(Math.random()*expanded.length)]:expanded[idx%expanded.length];playNote(note,1,time);const offId=Tone.Transport.scheduleOnce((offTime)=>{releaseNote(note,offTime);arpReleaseIdsRef.current.delete(offId);},time+intervalSeconds*0.7);arpReleaseIdsRef.current.add(offId);idx++;},`${intervalTicks}i`);return()=>{if(arpEventRef.current!==null){Tone.Transport.clear(arpEventRef.current);arpEventRef.current=null;}clearScheduledReleaseIds(arpReleaseIdsRef);};},[arpOn,arpMode,arpRate,arpOctaves,seqTempo,playNote,releaseNote,clearScheduledReleaseIds]);

  useEffect(()=>{if(seqEventRef.current!==null){Tone.Transport.clear(seqEventRef.current);seqEventRef.current=null;}clearScheduledReleaseIds(seqReleaseIdsRef);if(!seqOn||!audioRef.current){setSeqCurrentStep(-1);return;}let step=0;const intervalSeconds=(60/seqTempo)/4;seqEventRef.current=Tone.Transport.scheduleRepeat((time)=>{const stepIndex=step%seqLength;const s=seqSteps[stepIndex];setSeqCurrentStep(stepIndex);if(s&&s.active){playNote(s.note,1,time);const offId=Tone.Transport.scheduleOnce((offTime)=>{releaseNote(s.note,offTime);seqReleaseIdsRef.current.delete(offId);},time+intervalSeconds*0.7);seqReleaseIdsRef.current.add(offId);}step++;},"16n");return()=>{if(seqEventRef.current!==null){Tone.Transport.clear(seqEventRef.current);seqEventRef.current=null;}clearScheduledReleaseIds(seqReleaseIdsRef);};},[seqOn,seqSteps,seqLength,seqTempo,playNote,releaseNote,clearScheduledReleaseIds]);

  useEffect(()=>{const keyMap={a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13,l:14,p:15,";":16};const pressed=new Set();const onDown=(e)=>{if(e.repeat||e.target.tagName==="SELECT"||e.target.tagName==="INPUT")return;const k=e.key.toLowerCase();if(k==="z"){setKeyboardOctave(o=>Math.max(0,o-1));return;}if(k==="x"){setKeyboardOctave(o=>Math.min(7,o+1));return;}if(keyMap[k]!==undefined&&!pressed.has(k)){pressed.add(k);const midi=(keyboardOctave+1)*12+keyMap[k];registerHeldNote(midi);if(arpOn&&audioRef.current)audioRef.current.arpNotes=[...new Set([...audioRef.current.arpNotes,midi])];playNote(midi);setActiveNotes(p=>new Set([...p,midi]));}};const onUp=(e)=>{const k=e.key.toLowerCase();if(keyMap[k]!==undefined){pressed.delete(k);const midi=(keyboardOctave+1)*12+keyMap[k];unregisterHeldNote(midi);if(arpOn&&audioRef.current){audioRef.current.arpNotes=audioRef.current.arpNotes.filter(n=>n!==midi);if(audioRef.current.arpNotes.length===0)releaseNote(midi);}else releaseNote(midi);setActiveNotes(p=>{const n=new Set(p);n.delete(midi);return n;});}};window.addEventListener("keydown",onDown);window.addEventListener("keyup",onUp);return()=>{window.removeEventListener("keydown",onDown);window.removeEventListener("keyup",onUp);};},[keyboardOctave,playNote,releaseNote,arpOn,registerHeldNote,unregisterHeldNote]);

  useEffect(()=>()=>{if(seqEventRef.current!==null){Tone.Transport.clear(seqEventRef.current);seqEventRef.current=null;}if(arpEventRef.current!==null){Tone.Transport.clear(arpEventRef.current);arpEventRef.current=null;}clearScheduledReleaseIds(seqReleaseIdsRef);clearScheduledReleaseIds(arpReleaseIdsRef);clearScheduledReleaseIds(noteResetIdsRef);heldNotesRef.current=[];Tone.Transport.stop();Tone.Transport.cancel(0);if(midiRef.current.input){midiRef.current.input.onmidimessage=null;midiRef.current.input=null;}const a=audioRef.current;if(a){[a.osc1,a.osc2,a.noise,a.osc1Gain,a.osc2Gain,a.noiseGain,a.mixer,a.hpf,a.lpf,a.env,a.filterEnv,a.lfo,a.lfoGain,a.reverb,a.master].forEach(n=>{if(n&&typeof n.dispose==="function")n.dispose();});audioRef.current=null;}},[clearScheduledReleaseIds]);

  const toggleStep=(i)=>{const ns=[...seqSteps];ns[i]={...ns[i],active:!ns[i].active};setSeqSteps(ns);};
  const changeStepNote=(i,d)=>{const ns=[...seqSteps];ns[i]={...ns[i],note:Math.max(24,Math.min(96,ns[i].note+d))};setSeqSteps(ns);};
  const waveOptions=["sine","triangle","sawtooth","square"];
  const categories = ["All","Factory","Classic","Patchbook"];
  const filteredPresets = presetCategory === "All" ? PRESETS : PRESETS.filter(p => p.category === presetCategory);

  return (
    <div style={{width:"100%",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 30%,#1e1e1e,#0a0a0a)",display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 10px",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 4px #ff0066}50%{box-shadow:0 0 16px #ff0066}} select:focus{outline:none;border-color:#ff6600}`}</style>

      <div style={{display:"flex",maxWidth:1060,width:"100%",filter:"drop-shadow(0 10px 40px rgba(0,0,0,0.7))"}}>
        <WoodCheek side="left" />
        <div style={{flex:1,display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#1f1f1f,#171717 30%,#131313 70%,#111)",borderTop:"1px solid #333",borderBottom:"1px solid #222"}}>

          {/* ═══ PRESET & MIDI BAR ═══ */}
          <div style={{padding:"4px 10px",display:"flex",alignItems:"center",gap:6,background:"linear-gradient(180deg,#181818,#121212)",borderBottom:"1px solid #222",flexWrap:"wrap"}}>
            {/* Preset section */}
            <span style={{fontSize:8,fontWeight:700,letterSpacing:2,color:"#ff8844",textTransform:"uppercase"}}>PATCH</span>
            <select value={presetCategory} onChange={e=>setPresetCategory(e.target.value)} style={{background:"#1a1a1a",color:"#888",border:"1px solid #333",borderRadius:2,padding:"2px 4px",fontSize:7,cursor:"pointer",fontFamily:"'Helvetica Neue',sans-serif"}}>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={currentPreset} onChange={e=>loadPreset(Number(e.target.value))} style={{background:"#1a1a1a",color:"#ddd",border:"1px solid #444",borderRadius:2,padding:"3px 6px",fontSize:8,cursor:"pointer",maxWidth:180,fontFamily:"monospace",fontWeight:700}}>
              {PRESETS.map((p,i)=><option key={i} value={i}>{`${String(i+1).padStart(2,"0")} ${p.name}`}</option>)}
            </select>
            <div onClick={()=>loadPreset(Math.max(0,currentPreset-1))} style={{cursor:"pointer",color:"#666",fontSize:10,padding:"0 4px",userSelect:"none"}}>◀</div>
            <div onClick={()=>loadPreset(Math.min(PRESETS.length-1,currentPreset+1))} style={{cursor:"pointer",color:"#666",fontSize:10,padding:"0 4px",userSelect:"none"}}>▶</div>
            <span style={{fontSize:7,color:"#555",fontStyle:"italic",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{PRESETS[currentPreset]?.desc}</span>

            <div style={{flex:1}} />

            {/* MIDI section */}
            <div style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>setShowMidiPanel(!showMidiPanel)}>
              <span style={{fontSize:7,fontWeight:700,letterSpacing:1.5,color:"#555"}}>MIDI</span>
              <div style={{width:7,height:7,borderRadius:"50%",background:midiConnected?(midiActivity?"#00ff88":"#00aa55"):"#333",boxShadow:midiConnected?`0 0 4px ${midiActivity?"#00ff88":"#00aa5544"}`:"none",transition:"all 0.1s"}} />
            </div>
            <select value={midiDeviceId} onChange={e=>setMidiDeviceId(e.target.value)} style={{background:"#1a1a1a",color:"#888",border:"1px solid #333",borderRadius:2,padding:"2px 4px",fontSize:7,cursor:"pointer",maxWidth:140}}>
              <option value="">— MIDI In —</option>
              {midiDevices.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {lastMidiMsg && <span style={{fontSize:6,color:"#444",fontFamily:"monospace"}}>{lastMidiMsg}</span>}
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              <span style={{fontSize:6,color:"#444"}}>CLK</span>
              <IllumButton active={midiClockSync} onClick={()=>setMidiClockSync(!midiClockSync)} color="#0088ff" size={10} />
            </div>
            <span onClick={()=>setShowMidiPanel(!showMidiPanel)} style={{fontSize:8,color:"#444",cursor:"pointer",userSelect:"none"}}>{showMidiPanel?"▲":"▼"}</span>
          </div>

          {/* Expanded MIDI */}
          {showMidiPanel && (
            <div style={{padding:"6px 12px",background:"#0e0e0e",borderBottom:"1px solid #1a1a1a",display:"flex",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:7,color:"#666",fontWeight:700,letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:3}}>CC Map (right-click knob to learn)</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                  {Object.entries(ccMap).sort((a,b)=>Number(a[0])-Number(b[0])).map(([cc,m])=>(
                    <div key={cc} onClick={()=>setMidiLearnTarget(m.param)} style={{padding:"1px 5px",borderRadius:2,fontSize:6,background:"#151515",border:"1px solid #222",color:"#666",fontFamily:"monospace",cursor:"pointer"}}>
                      <span style={{color:"#ff6600",fontWeight:700}}>CC{cc}</span>→{m.param}
                    </div>
                  ))}
                </div>
                {midiLearnTarget && <div style={{marginTop:4,fontSize:7,color:"#ff0066",fontWeight:700}}>LEARN MODE: {midiLearnTarget} — move a CC knob now</div>}
              </div>
              <div style={{fontSize:7,color:"#444",lineHeight:1.8,fontFamily:"monospace",minWidth:120}}>
                <div>Devices: {midiDevices.length}</div>
                <div>Connected: {midiConnected?"✓":"—"}</div>
                <div>Velocity: On</div>
                <div>Bend: ±2st</div>
              </div>
            </div>
          )}

          {/* ═══ PRESET BROWSER (collapsible) ═══ */}
          <div style={{padding:"3px 8px",background:"#131313",borderBottom:"1px solid #1a1a1a",display:"flex",gap:2,overflowX:"auto",overflowY:"hidden"}}>
            {filteredPresets.map((p,i)=>{
              const realIdx = PRESETS.indexOf(p);
              return (
                <div key={realIdx} onClick={()=>loadPreset(realIdx)} style={{
                  padding:"3px 8px",borderRadius:2,cursor:"pointer",whiteSpace:"nowrap",
                  background:currentPreset===realIdx?"#ff660022":"transparent",
                  border:`1px solid ${currentPreset===realIdx?"#ff660044":"transparent"}`,
                  transition:"all 0.1s",
                }}>
                  <span style={{fontSize:7,fontWeight:currentPreset===realIdx?700:400,color:currentPreset===realIdx?"#ff8844":"#555",fontFamily:"monospace"}}>
                    {p.name}
                  </span>
                  <span style={{fontSize:5.5,color:"#333",marginLeft:4}}>{p.category}</span>
                </div>
              );
            })}
          </div>

          {/* ═══ CONTROL PANEL ═══ */}
          <div style={{padding:"8px 6px 6px",display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            <Panel color="#2d2328" style={{width:100,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel dark>Arpeggio</SectionLabel>
              <div style={{display:"flex",justifyContent:"center"}}><Knob value={arpRate} onChange={setArpRate} min={1} max={16} steps={1} label="Rate" size={40} paramId="arpRate" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} /></div>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:2}}>
                <ToggleSwitch value={arpMode} options={["up","down","updown"]} onChange={setArpMode} label="Pattern" />
                <ToggleSwitch value={String(arpOctaves)} options={["1","2","3"]} onChange={v=>setArpOctaves(Number(v))} label="Oct" />
              </div>
              <div style={{display:"flex",justifyContent:"center",marginTop:4}}><IllumButton active={arpOn} onClick={()=>setArpOn(!arpOn)} color="#ff5500" size={20} /></div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:4,borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:4}}><PatchJack label="Gate" /><PatchJack label="Clk" /></div>
            </Panel>

            <Panel color="#3a6080" style={{width:125,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel>Modulation</SectionLabel>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>
                <Knob value={lfoRate} onChange={setLfoRate} min={0.1} max={30} label="Rate" size={46} paramId="lfoRate" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <Knob value={lfoDepth} onChange={setLfoDepth} min={0} max={1} label="Depth" size={46} paramId="lfoDepth" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:10,alignItems:"center"}}>
                <ToggleSwitch value={lfoWave} options={waveOptions} onChange={setLfoWave} label="Wave" />
                <IllumButton active={lfoDepth>0} color="#ff6622" size={24} onClick={()=>setLfoDepth(lfoDepth>0?0:0.5)} />
                <ToggleSwitch value={lfoTarget} options={["filter","pitch","amp"]} onChange={setLfoTarget} label="Dest" />
              </div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:4,borderTop:"1px solid rgba(0,0,0,0.2)",paddingTop:4}}><PatchJack label="Rate" /><PatchJack label="Wave" /><PatchJack label="Out" /></div>
            </Panel>

            <Panel color="#b8a882" style={{width:210,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel>Oscillators</SectionLabel>
              <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:7,color:"#444",fontWeight:700,letterSpacing:1}}>VCO 1</span>
                  <Knob value={osc1Level} onChange={setOsc1Level} min={0} max={1} label="Level" size={42} paramId="osc1Level" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                  <div style={{display:"flex",gap:8}}><ToggleSwitch value={osc1Wave} options={waveOptions} onChange={setOsc1Wave} label="Wave" /><ToggleSwitch value={String(osc1Octave)} options={["-2","-1","0","1"]} onChange={v=>setOsc1Octave(Number(v))} label="Range" /></div>
                </div>
                <div style={{width:1,background:"rgba(0,0,0,0.15)",margin:"8px 0"}} />
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:7,color:"#444",fontWeight:700,letterSpacing:1}}>VCO 2</span>
                  <Knob value={osc2Level} onChange={setOsc2Level} min={0} max={1} label="Level" size={42} paramId="osc2Level" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                  <div style={{display:"flex",gap:8}}><ToggleSwitch value={osc2Wave} options={waveOptions} onChange={setOsc2Wave} label="Wave" /><ToggleSwitch value={String(osc2Octave)} options={["-2","-1","0","1"]} onChange={v=>setOsc2Octave(Number(v))} label="Range" /></div>
                  <Knob value={osc2Detune} onChange={setOsc2Detune} min={-100} max={100} label="Freq" size={34} paramId="osc2Detune" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                </div>
              </div>
              <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:2,borderTop:"1px solid rgba(0,0,0,0.15)",paddingTop:4}}><PatchJack label="1 Out" /><PatchJack label="2 Out" /><PatchJack label="Pwm" /><PatchJack label="Sync" /><PatchJack label="1V/O" /><PatchJack label="2V/O" /></div>
            </Panel>

            <Panel color="#4a8a5a" style={{width:88,display:"flex",flexDirection:"column",gap:3}}>
              <SectionLabel>Mixer</SectionLabel>
              <Knob value={osc1Level} onChange={setOsc1Level} min={0} max={1} label="Osc 1" size={36} paramId="osc1Level" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              <Knob value={osc2Level} onChange={setOsc2Level} min={0} max={1} label="Osc 2" size={36} paramId="osc2Level" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              <Knob value={noiseLevel} onChange={setNoiseLevel} min={0} max={0.5} label="Noise" size={36} paramId="noiseLevel" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:2,borderTop:"1px solid rgba(0,0,0,0.15)",paddingTop:4}}><PatchJack label="Ext" /><PatchJack label="Out" /></div>
            </Panel>

            <Panel color="#4a8a5a" style={{width:125,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel>Filter</SectionLabel>
              <div style={{display:"flex",justifyContent:"center",gap:6}}>
                <Knob value={filterCutoff} onChange={setFilterCutoff} min={20} max={20000} label="Cutoff" size={52} numbered paramId="filterCutoff" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center"}}>
                  <Knob value={filterRes} onChange={setFilterRes} min={0} max={20} label="Res" size={36} paramId="filterRes" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                  <Knob value={filterEnvAmt} onChange={setFilterEnvAmt} min={0} max={1} label="Env" size={32} paramId="filterEnvAmt" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                </div>
              </div>
              <Knob value={hpfCutoff} onChange={setHpfCutoff} min={0} max={2000} label="HPF" size={32} paramId="hpfCutoff" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:2,borderTop:"1px solid rgba(0,0,0,0.15)",paddingTop:4}}><PatchJack label="Cut" /><PatchJack label="Res" /><PatchJack label="In" /><PatchJack label="Out" /></div>
            </Panel>

            <Panel color="#2a2a2a" style={{width:135,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel dark>Envelope</SectionLabel>
              <div style={{display:"flex",justifyContent:"center",gap:4}}>
                <Knob value={attack} onChange={setAttack} min={0.001} max={4} label="A" size={36} paramId="attack" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <Knob value={decay} onChange={setDecay} min={0.01} max={4} label="D" size={36} paramId="decay" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <Knob value={sustain} onChange={setSustain} min={0} max={1} label="S" size={36} paramId="sustain" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <Knob value={release} onChange={setRelease} min={0.01} max={8} label="R" size={36} paramId="release" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              </div>
              <svg width={115} height={32} style={{margin:"0 auto",display:"block"}}><defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff8844" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff8844" stopOpacity="0.03" /></linearGradient></defs><polygon points={`4,29 ${4+attack*18},3 ${4+attack*18+decay*14},${29-sustain*25} ${80},${29-sustain*25} ${80+Math.min(release*4,28)},29`} fill="url(#eg)" stroke="#ff8844" strokeWidth={1.5} strokeLinejoin="round" /></svg>
              <div style={{display:"flex",gap:5,justifyContent:"center",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:4}}><PatchJack label="Gate" /><PatchJack label="Trig" /><PatchJack label="Out" /><PatchJack label="End" /></div>
            </Panel>

            <Panel color="#38263e" style={{width:108,display:"flex",flexDirection:"column",gap:4}}>
              <SectionLabel dark>Spring Reverb</SectionLabel>
              <div style={{display:"flex",justifyContent:"center",gap:6}}>
                <Knob value={reverbMix} onChange={setReverbMix} min={0} max={1} label="Mix" size={40} paramId="reverbMix" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                <Knob value={reverbDecay} onChange={v=>{setReverbDecay(v);if(audioRef.current)audioRef.current.reverb.decay=v;}} min={0.1} max={10} label="Time" size={40} paramId="reverbDecay" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:4,marginTop:2}}>
                <SectionLabel dark>Output</SectionLabel>
                <div style={{display:"flex",justifyContent:"center",gap:6}}>
                  <Knob value={masterVol} onChange={setMasterVol} min={0} max={1} label="Vol" size={46} paramId="masterVol" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                  <Knob value={glide} onChange={setGlide} min={0} max={1} label="Glide" size={34} paramId="glide" midiLearn={midiLearnTarget} onMidiLearn={setMidiLearnTarget} />
                </div>
              </div>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:4,borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:4}}><PatchJack label="In" /><PatchJack label="Main" /><PatchJack label="HP" /></div>
            </Panel>
          </div>

          {/* ═══ BRANDING ═══ */}
          <div style={{padding:"5px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid #2a2a2a",borderBottom:"1px solid #2a2a2a",background:"linear-gradient(180deg,#1a1a1a,#141414)"}}>
            <div style={{display:"flex",alignItems:"baseline"}}><span style={{fontSize:30,fontWeight:800,letterSpacing:2,color:"#e8dcc8",fontFamily:"'Helvetica Neue',Helvetica,sans-serif"}}>DOOM</span><span style={{fontSize:30,fontWeight:200,color:"#ff5533",fontFamily:"'Helvetica Neue',Helvetica,sans-serif"}}>STEPMOTHER</span></div>
            <span style={{fontSize:7.5,color:"#555",letterSpacing:3,textTransform:"uppercase",fontWeight:500}}>Semi-Modular Digital Synthesizer</span>
            {!started?(<button onClick={initAudio} style={{background:"linear-gradient(180deg,#cc2200,#881100)",color:"#fff",border:"1px solid #ff4422",borderRadius:3,padding:"6px 18px",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:2,textTransform:"uppercase",fontFamily:"'Helvetica Neue',sans-serif",boxShadow:"0 0 15px #ff220044,0 2px 6px rgba(0,0,0,0.5)"}}>⚡ Power On</button>):(<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:"#ff3300",boxShadow:"0 0 8px #ff3300,0 0 20px #ff330044"}} /><span style={{fontSize:7,color:"#444",letterSpacing:1}}>ON</span></div>)}
          </div>

          {/* ═══ SEQUENCER ═══ */}
          <div style={{padding:"6px 10px",background:"linear-gradient(180deg,#141414,#101010)",borderBottom:"1px solid #222"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:8,fontWeight:700,letterSpacing:2,color:"#777",textTransform:"uppercase"}}>Sequencer</span>
                <IllumButton active={seqOn} onClick={()=>setSeqOn(!seqOn)} color="#ff3300" size={14} />
                {midiClockSync&&<span style={{fontSize:7,color:"#0088ff",fontWeight:700}}>EXT</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Knob value={seqTempo} onChange={setSeqTempo} min={40} max={240} size={24} cream={false} />
                <span style={{fontSize:11,color:midiClockSync?"#0088ff":"#ff6600",fontWeight:700,fontFamily:"monospace"}}>{Math.round(seqTempo)}</span>
                <span style={{fontSize:7,color:"#555"}}>BPM</span>
              </div>
            </div>
            <div style={{display:"flex",gap:2,justifyContent:"center"}}>
              {seqSteps.slice(0,seqLength).map((step,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,width:50,padding:"2px 1px",background:seqCurrentStep===i?"rgba(255,80,0,0.1)":"transparent",borderRadius:2,border:`1px solid ${seqCurrentStep===i?"#ff440022":"transparent"}`}}>
                  <span style={{fontSize:6,color:"#444",fontFamily:"monospace"}}>{i+1}</span>
                  <div onClick={()=>changeStepNote(i,1)} style={{cursor:"pointer",fontSize:7,color:"#555",userSelect:"none",lineHeight:1}}>▲</div>
                  <span style={{fontSize:8,color:step.active?"#ff8844":"#333",fontWeight:700,fontFamily:"monospace"}}>{midiToNote(step.note)}</span>
                  <div onClick={()=>changeStepNote(i,-1)} style={{cursor:"pointer",fontSize:7,color:"#555",userSelect:"none",lineHeight:1}}>▼</div>
                  <div onClick={()=>toggleStep(i)} style={{width:11,height:11,borderRadius:2,cursor:"pointer",background:step.active?(seqCurrentStep===i?"#ff3300":"#ff6600"):"#252525",boxShadow:step.active?`0 0 5px ${seqCurrentStep===i?"#ff330055":"#ff660022"}`:"inset 0 1px 2px rgba(0,0,0,0.5)",border:"1px solid #444"}} />
                </div>
              ))}
            </div>
          </div>

          {/* ═══ KEYBOARD ═══ */}
          <div style={{display:"flex",background:"linear-gradient(180deg,#0e0e0e,#080808)",padding:"8px 4px 4px"}}>
            <div style={{display:"flex",gap:10,padding:"6px 12px 6px 8px",alignItems:"center"}}>
              {["PITCH","MOD"].map(w=>(<div key={w} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:6,color:"#444",letterSpacing:1.5,fontWeight:600}}>{w}</span><div style={{width:20,height:90,borderRadius:10,background:"linear-gradient(90deg,#c8c0a8,#e8e0d0 25%,#f0e8d8 50%,#e8e0d0 75%,#c8c0a8)",boxShadow:"0 3px 8px rgba(0,0,0,0.5),inset 0 1px 2px rgba(255,255,240,0.3)",border:"1px solid #b0a890",position:"relative",overflow:"hidden"}}>{Array(14).fill(0).map((_,i)=><div key={i} style={{position:"absolute",left:3,right:3,top:6+i*5.8,height:0.8,background:"rgba(0,0,0,0.1)",borderRadius:1}} />)}{w==="PITCH"&&Math.abs(pitchBend)>0.01&&<div style={{position:"absolute",left:2,right:2,top:`${50-pitchBend*40}%`,height:3,background:"#ff660088",borderRadius:2,transition:"top 0.05s"}} />}</div></div>))}
            </div>
            <div style={{flex:1,position:"relative",height:110}}>
              <div style={{display:"flex",height:"100%"}}>
                {Array(19).fill(0).map((_,i)=>{const wn=[0,2,4,5,7,9,11];const oo=Math.floor(i/7);const nn=wn[i%7];const midi=(keyboardOctave+1)*12+oo*12+nn;const act=activeNotes.has(midi);return(<div key={`w${i}`} onMouseDown={e=>{e.preventDefault();playNote(midi);setActiveNotes(p=>new Set([...p,midi]));}} onMouseUp={()=>{releaseNote(midi);setActiveNotes(p=>{const n=new Set(p);n.delete(midi);return n;});}} onMouseLeave={()=>{if(activeNotes.has(midi)){releaseNote(midi);setActiveNotes(p=>{const n=new Set(p);n.delete(midi);return n;});}}} style={{flex:"1 1 0",height:"100%",minWidth:0,borderRadius:"0 0 4px 4px",cursor:"pointer",zIndex:1,marginRight:-0.5,background:act?"linear-gradient(180deg,#e0d8c8,#ff8844 85%,#ff6622)":"linear-gradient(180deg,#faf6ee,#f0ece0 15%,#eae4d8 75%,#e0d8c8)",border:"1px solid #b0a898",boxShadow:act?"0 0 15px #ff884433":"inset 0 -6px 12px rgba(0,0,0,0.03),0 2px 3px rgba(0,0,0,0.08)",transition:"background 0.04s"}} />);})}
              </div>
              {Array(15).fill(0).map((_,i)=>{const bp=[0,1,3,4,5];const bn=[1,3,6,8,10];const oo=Math.floor(i/5);if(oo>=3)return null;const pp=bp[i%5];const nn=bn[i%5];const midi=(keyboardOctave+1)*12+oo*12+nn;const act=activeNotes.has(midi);const kw=100/19;const xp=(oo*7+pp+0.55)*kw;return(<div key={`b${i}`} onMouseDown={e=>{e.preventDefault();playNote(midi);setActiveNotes(p=>new Set([...p,midi]));}} onMouseUp={()=>{releaseNote(midi);setActiveNotes(p=>{const n=new Set(p);n.delete(midi);return n;});}} onMouseLeave={()=>{if(activeNotes.has(midi)){releaseNote(midi);setActiveNotes(p=>{const n=new Set(p);n.delete(midi);return n;});}}} style={{position:"absolute",top:0,left:`${xp}%`,width:`${kw*0.62}%`,height:"58%",borderRadius:"0 0 3px 3px",cursor:"pointer",zIndex:2,background:act?"linear-gradient(180deg,#333,#ff4400 90%)":"linear-gradient(180deg,#2a2a28,#1a1a18 35%,#111 85%,#0a0a0a)",border:"1px solid #000",boxShadow:act?"0 0 12px #ff440044":"0 3px 8px rgba(0,0,0,0.6),inset 0 -3px 5px rgba(0,0,0,0.3)",transition:"background 0.04s"}} />);})}
            </div>
          </div>

          <div style={{padding:"4px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0a0a0a",borderTop:"1px solid #1a1a1a"}}>
            <span style={{fontSize:7,color:"#2a2a2a",letterSpacing:1.5}}>OCT {keyboardOctave} • Z/X SHIFT • A-; PLAY • RIGHT-CLICK KNOB = MIDI LEARN</span>
            <span style={{fontSize:11,fontWeight:200,letterSpacing:5,color:"#333",fontFamily:"'Helvetica Neue',sans-serif",fontStyle:"italic"}}>doom</span>
          </div>
        </div>
        <WoodCheek side="right" />
      </div>
    </div>
  );
}
