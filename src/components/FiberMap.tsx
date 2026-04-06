import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from 'react-simple-maps';
import { Globe, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const markers = [
  { markerOffset: -15, name: "London", coordinates: [-0.1278, 51.5074] },
  { markerOffset: -15, name: "New York", coordinates: [-74.006, 40.7128] },
  { markerOffset: 25, name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { markerOffset: 25, name: "Singapore", coordinates: [103.8198, 1.3521] },
  { markerOffset: -15, name: "San Francisco", coordinates: [-122.4194, 37.7749] },
  { markerOffset: 25, name: "Sydney", coordinates: [151.2093, -33.8688] },
];

const connections = [
  { from: [-74.006, 40.7128], to: [-0.1278, 51.5074] },
  { from: [-0.1278, 51.5074], to: [139.6917, 35.6895] },
  { from: [139.6917, 35.6895], to: [151.2093, -33.8688] },
  { from: [-122.4194, 37.7749], to: [-74.006, 40.7128] },
];

export const FiberMap: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Globe className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Global Fiber Network</h3>
            <p className="text-slate-500 text-sm">Real-time visualization of active Shelby Storage Providers.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500/20 rounded-full" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Standby</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full relative">
        <ComposableMap
          projectionConfig={{
            scale: 160,
          }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0f172a"
                  stroke="#1e293b"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1e293b", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {connections.map((conn, i) => (
            <Line
              key={i}
              from={conn.from as [number, number]}
              to={conn.to as [number, number]}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              className="opacity-20 animate-pulse"
            />
          ))}

          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates as [number, number]}>
              <circle r={4} fill="#3b82f6" className="animate-pulse" />
              <circle r={8} fill="#3b82f6" className="opacity-20 animate-ping" />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fontFamily: "Inter", fill: "#94a3b8", fontSize: "8px", fontWeight: "bold", textTransform: "uppercase" }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
        
        {/* Glowing Overlays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-8 relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Nodes</p>
          <p className="text-xl font-mono font-bold text-white">1,240</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Data Stored</p>
          <p className="text-xl font-mono font-bold text-blue-400">8.4 PB</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Network Speed</p>
          <p className="text-xl font-mono font-bold text-green-400">12.5 Tbps</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Uptime</p>
          <p className="text-xl font-mono font-bold text-white">99.99%</p>
        </div>
      </div>
    </div>
  );
};
