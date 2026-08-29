import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Warehouse,
  Truck,
  TrendingUp,
  Scale,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CropType } from '../types';

interface InteractiveMapProps {
  currentCrop: CropType;
  farmerDistrict: string;
  farmerQuantity: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentCrop,
  farmerDistrict,
  farmerQuantity,
}) => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    type: 'farmer' | 'mandi' | 'buyer' | 'storage';
    location: string;
    distanceKm: number;
    pricePerQ?: number;
    netRealizationPerQ?: number;
    description: string;
  }>({
    id: 'farmer_akola',
    title: 'Farmer Ramesh Patil (Origin)',
    type: 'farmer',
    location: 'Murtizapur, Akola',
    distanceKm: 0,
    pricePerQ: 5000,
    netRealizationPerQ: 4850,
    description: '8.5 acre farm gate. Registered lot: 20 quintals Grade A Soybean.',
  });

  const nodes = [
    { id: 'farmer_akola', x: 260, y: 170, title: 'Ramesh Farm Gate', type: 'farmer' as const, location: 'Murtizapur, Akola', distanceKm: 0, pricePerQ: 5000, netRealizationPerQ: 4850, description: 'Farmer Farm origin with 20q Grade A produce.' },
    { id: 'mkt_akola', x: 250, y: 155, title: 'Akola APMC Mandi', type: 'mandi' as const, location: 'Akola Town', distanceKm: 15, pricePerQ: 5000, netRealizationPerQ: 4850, description: '15 km. High liquidity spot market with 1.05% mandi cess.' },
    { id: 'mkt_washim', x: 270, y: 220, title: 'Washim APMC Mandi', type: 'mandi' as const, location: 'Washim', distanceKm: 65, pricePerQ: 5150, netRealizationPerQ: 4900, description: '65 km. Higher modal rate (+₹150/q) offsetting 65 km transit.' },
    { id: 'mkt_amravati', x: 330, y: 130, title: 'Amravati APMC', type: 'mandi' as const, location: 'Amravati', distanceKm: 90, pricePerQ: 5080, netRealizationPerQ: 4850, description: '90 km. High arrivals from eastern Vidarbha.' },
    { id: 'buyer_abc', x: 280, y: 150, title: 'ABC Agro Foods (Buyer)', type: 'buyer' as const, location: 'MIDC Phase 1, Akola', distanceKm: 35, pricePerQ: 5200, netRealizationPerQ: 5050, description: '35 km. Top buyer offer (+₹200/q over mandi), direct procurement.' },
    { id: 'buyer_vidarbha', x: 230, y: 165, title: 'Vidarbha Solvent Mills', type: 'buyer' as const, location: 'Khamgaon Road, Akola', distanceKm: 22, pricePerQ: 5180, netRealizationPerQ: 5035, description: '22 km. Processing buyer requiring 150 quintals.' },
    { id: 'store_akola', x: 265, y: 180, title: 'Akola Agri Warehouse (WDRA)', type: 'storage' as const, location: 'MIDC Phase 2, Akola', distanceKm: 8, pricePerQ: 5350, netRealizationPerQ: 5150, description: '8 km. WDRA accredited godown at ₹4/q/day with 650q open space.' },
    { id: 'mkt_nagpur', x: 420, y: 110, title: 'Kalamna APMC Nagpur', type: 'mandi' as const, location: 'Nagpur', distanceKm: 245, pricePerQ: 5130, netRealizationPerQ: 4720, description: '245 km. Major commercial hub, but long freight reduces net realization.' },
    { id: 'mkt_nashik', x: 110, y: 220, title: 'Lasalgaon APMC (Nashik)', type: 'mandi' as const, location: 'Nashik', distanceKm: 340, pricePerQ: 2580, netRealizationPerQ: 2210, description: '340 km. Prime onion trading hub.' },
    { id: 'mkt_pune', x: 115, y: 310, title: 'Gultekdi APMC Pune', type: 'mandi' as const, location: 'Pune', distanceKm: 480, pricePerQ: 2150, netRealizationPerQ: 1720, description: '480 km. Urban consumer market with high perishable demand.' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Maharashtra Agro-Logistics Corridor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Spatial Price & Logistics Radius Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Interactive spatial view of mandis, institutional buyers, and WDRA storage facilities centered around Akola.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              ● Origin: Akola (Farmer)
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              ■ Buyers
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              ▲ Storage
            </span>
          </div>
        </div>
      </div>

      {/* Map Layout: SVG Canvas (Left 8 Cols) + Detail Card (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Maharashtra Agro Map */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-md text-white flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Maharashtra State Agricultural Network
            </span>
            <span className="text-[11px] text-indigo-400 font-medium">Click any marker to inspect</span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-slate-950/70 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            
            <svg
              viewBox="0 0 500 400"
              className="w-full h-full select-none"
            >
              {/* Maharashtra Silhouette Outline */}
              <path
                d="M 50 180 Q 90 120 170 120 T 310 90 T 450 90 T 480 150 T 430 230 T 360 300 T 260 360 T 170 370 T 90 310 T 60 220 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Distance Radii Centered around Akola (260, 170) */}
              <circle cx="260" cy="170" r="35" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <text x="265" y="140" fill="#818cf8" fontSize="8" opacity="0.8">25 km</text>

              <circle cx="260" cy="170" r="70" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <text x="265" y="105" fill="#818cf8" fontSize="8" opacity="0.7">75 km</text>

              <circle cx="260" cy="170" r="140" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <text x="265" y="40" fill="#818cf8" fontSize="8" opacity="0.6">150 km</text>

              {/* Connecting logistics route lines from Farmer to destinations */}
              {nodes.map((node) => {
                if (node.id === 'farmer_akola') return null;
                const isSelected = selectedNode.id === node.id;
                return (
                  <line
                    key={`line-${node.id}`}
                    x1="260"
                    y1="170"
                    x2={node.x}
                    y2={node.y}
                    stroke={isSelected ? '#818cf8' : '#475569'}
                    strokeWidth={isSelected ? '2' : '1'}
                    strokeDasharray={node.type === 'buyer' ? '4 2' : 'none'}
                    opacity={isSelected ? 1 : 0.4}
                  />
                );
              })}

              {/* Nodes and Markers */}
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isFarmer = node.type === 'farmer';
                const isBuyer = node.type === 'buyer';
                const isStorage = node.type === 'storage';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition hover:opacity-100"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Outer Glow */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isFarmer ? 16 : 14}
                        fill={isFarmer ? '#6366f1' : isBuyer ? '#3b82f6' : isStorage ? '#f59e0b' : '#a855f7'}
                        opacity="0.3"
                      />
                    )}

                    {/* Main Icon Shape */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isFarmer ? 8 : 6}
                      fill={
                        isFarmer ? '#6366f1' :
                        isBuyer ? '#3b82f6' :
                        isStorage ? '#f59e0b' :
                        '#94a3b8'
                      }
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x + 8}
                      y={node.y + 3}
                      fill={isSelected ? '#a5b4fc' : '#cbd5e1'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Vidarbha Agro Belt (Akola Hub)</span>
            <span>Western Maharashtra Logistics Grid</span>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                selectedNode.type === 'farmer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                selectedNode.type === 'buyer' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                selectedNode.type === 'storage' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedNode.type}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{selectedNode.distanceKm} km from Origin</span>
            </div>

            <h3 className="font-bold text-lg text-slate-900">{selectedNode.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedNode.location}</p>

            <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs leading-relaxed text-slate-700">
              {selectedNode.description}
            </div>

            {selectedNode.pricePerQ && (
              <div className="space-y-2 bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-medium">Offered / Modal Rate:</span>
                  <span className="font-bold text-slate-900">₹{selectedNode.pricePerQ.toLocaleString()}/q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-900 font-bold">Net Realization for 20q:</span>
                  <span className="font-bold text-indigo-700">₹{selectedNode.netRealizationPerQ?.toLocaleString()}/q</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Click on any marker on the map to compare freight impact across Maharashtra districts.
          </div>
        </div>

      </div>

    </div>
  );
};
