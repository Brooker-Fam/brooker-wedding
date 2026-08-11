"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Topo map of the corridor with markers per scenario. Coordinates are
   approximate (±200 m) — good for orientation, not navigation. */

export type MapPoint = {
  name: string;
  emoji: string;
  lat: number;
  lon: number;
};

export const MAP_POINTS: Record<string, MapPoint> = {
  loj: { name: "Adirondak Loj (trailhead)", emoji: "🅿️", lat: 44.1829, lon: -73.9639 },
  upperworks: { name: "Upper Works (trailhead)", emoji: "🅿️", lat: 44.0886, lon: -74.0562 },
  marcydam: { name: "Marcy Dam (camp)", emoji: "⛺", lat: 44.1594, lon: -73.9513 },
  flowed: { name: "Flowed Lands (camp)", emoji: "⛺", lat: 44.1147, lon: -73.9975 },
  lakecolden: { name: "Lake Colden (camp)", emoji: "⛺", lat: 44.124, lon: -73.986 },
  marcy: { name: "Mount Marcy 5,344 ft", emoji: "⛰️", lat: 44.1126, lon: -73.9235 },
  phelps: { name: "Phelps 4,161 ft", emoji: "⛰️", lat: 44.1615, lon: -73.927 },
  tabletop: { name: "Tabletop 4,427 ft", emoji: "⛰️", lat: 44.1354, lon: -73.9282 },
  colden: { name: "Mount Colden 4,714 ft", emoji: "⛰️", lat: 44.1191, lon: -73.96 },
  algonquin: { name: "Algonquin 5,114 ft", emoji: "⛰️", lat: 44.1436, lon: -73.9866 },
  wright: { name: "Wright 4,580 ft", emoji: "⛰️", lat: 44.1516, lon: -73.977 },
  marshall: { name: "Mount Marshall 4,360 ft", emoji: "⛰️", lat: 44.127, lon: -74.0117 },
  wreck: { name: "Plane wreck (Cold Brook Pass)", emoji: "✈️", lat: 44.1305, lon: -74.006 },
  indianfalls: { name: "Indian Falls (last water for Marcy)", emoji: "💧", lat: 44.1385, lon: -73.9375 },
  lakearnold: { name: "Lake Arnold (the muddy way to Colden)", emoji: "💧", lat: 44.1305, lon: -73.9485 },
  feldspar: { name: "Feldspar lean-to", emoji: "🛖", lat: 44.1119, lon: -73.9585 },
  henderson: { name: "Henderson Monument (Calamity Pond)", emoji: "🪦", lat: 44.1105, lon: -74.0022 },
};

export default function TripMap({ pointKeys }: { pointKeys: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 16,
      attribution:
        'Map: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const points = pointKeys.map((k) => MAP_POINTS[k]).filter(Boolean);
    if (points.length === 0) return;

    for (const p of points) {
      L.marker([p.lat, p.lon], {
        icon: L.divIcon({
          className: "",
          html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">${p.emoji}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
        .bindTooltip(p.name, { direction: "top", offset: [0, -10] })
        .addTo(layer);
    }

    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lon] as [number, number])), {
      padding: [40, 40],
    });
  }, [pointKeys]);

  return (
    <div className="overflow-hidden rounded-2xl border border-sage/25">
      <div ref={containerRef} className="h-[24rem] w-full sm:h-[28rem]" />
      <p className="bg-sage/10 px-3 py-1.5 text-[11px] opacity-80">
        Markers are approximate — orient with this, navigate with the paper map. Trails render on
        the topo layer as you zoom in.
      </p>
    </div>
  );
}
