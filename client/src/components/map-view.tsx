import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Layers } from "lucide-react";
import type { Report } from "@/types/report";
import type { HeatmapPoint } from "@shared/schema";

// Leaflet types and imports
declare global {
  interface Window {
    L: any;
  }
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [clustersEnabled, setClustersEnabled] = useState(true);
  const [markersLayer, setMarkersLayer] = useState<any>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<any>(null);

  const { data: reports } = useQuery<Report[]>({
    queryKey: ['/api/reports']
  });

  const { data: heatmapData } = useQuery<HeatmapPoint[]>({
    queryKey: ['/api/heatmap']
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });

        // Load MarkerCluster
        const clusterCSS = document.createElement('link');
        clusterCSS.rel = 'stylesheet';
        clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
        document.head.appendChild(clusterCSS);

        const clusterDefaultCSS = document.createElement('link');
        clusterDefaultCSS.rel = 'stylesheet';  
        clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
        document.head.appendChild(clusterDefaultCSS);

        const clusterScript = document.createElement('script');
        clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
        document.head.appendChild(clusterScript);

        // Load Heatmap
        const heatScript = document.createElement('script');
        heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
        document.head.appendChild(heatScript);

        await new Promise((resolve) => {
          let loaded = 0;
          const checkLoaded = () => {
            loaded++;
            if (loaded === 2) resolve(null);
          };
          clusterScript.onload = checkLoaded;
          heatScript.onload = checkLoaded;
        });
      }

      // Initialize map
      const newMap = window.L.map(mapRef.current).setView([37.7749, -122.4194], 10);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);

      setMap(newMap);
    };

    loadLeaflet();
  }, [map]);

  // Update markers when reports change
  useEffect(() => {
    if (!map || !reports || !window.L) return;

    // Clear existing markers
    if (markersLayer) {
      map.removeLayer(markersLayer);
    }

    const markers = clustersEnabled ? 
      window.L.markerClusterGroup() : 
      window.L.layerGroup();

    reports.forEach((report) => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'Resolved': return 'green';
          case 'Under Review': return 'yellow';
          default: return 'red';
        }
      };

      const marker = window.L.marker([report.latitude, report.longitude])
        .bindPopup(`
          <div class="p-2">
            <img src="${report.imageUrl}" alt="Billboard" class="w-32 h-20 object-cover rounded mb-2" />
            <div class="text-sm">
              <strong>${report.location}</strong><br/>
              <span class="text-${getMarkerColor(report.status)}-600">${report.violationType}</span><br/>
              <span class="text-gray-500">${report.status}</span>
            </div>
          </div>
        `);

      markers.addLayer(marker);
    });

    markers.addTo(map);
    setMarkersLayer(markers);
  }, [map, reports, clustersEnabled]);

  // Update heatmap when enabled/disabled
  useEffect(() => {
    if (!map || !heatmapData || !window.L) return;

    if (heatmapLayer) {
      map.removeLayer(heatmapLayer);
      setHeatmapLayer(null);
    }

    if (heatmapEnabled && window.L.heatLayer) {
      const heatData = heatmapData.map(point => [point.lat, point.lng, point.intensity]);
      const heat = window.L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: 'blue',
          0.4: 'lime',
          0.6: 'yellow',
          0.8: 'orange',
          1.0: 'red'
        }
      });
      
      heat.addTo(map);
      setHeatmapLayer(heat);
    }
  }, [map, heatmapData, heatmapEnabled]);

  const toggleHeatmap = () => {
    setHeatmapEnabled(!heatmapEnabled);
  };

  const toggleClusters = () => {
    setClustersEnabled(!clustersEnabled);
  };

  return (
    <Card className="border-border" data-testid="card-map-view">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Report Locations</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={heatmapEnabled ? "default" : "outline"}
              onClick={toggleHeatmap}
              data-testid="button-toggle-heatmap"
            >
              <Flame className="w-4 h-4 mr-1" />
              Heatmap
            </Button>
            <Button
              size="sm"
              variant={clustersEnabled ? "default" : "outline"}
              onClick={toggleClusters}
              data-testid="button-toggle-clusters"
            >
              <Layers className="w-4 h-4 mr-1" />
              Clusters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="h-96 rounded-lg border border-border bg-muted/20"
          data-testid="map-container"
        />
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Resolved</span>
            </div>
          </div>
          <span data-testid="text-location-count">
            {reports?.length || 0} locations
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
