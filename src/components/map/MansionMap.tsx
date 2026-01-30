import { useEffect, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useSearchStore } from '../../store';
import { MansionPopup } from '../mansion';
import type { Mansion, MapBounds } from '../../types';

// 커스텀 마커 아이콘 (복수 물건 개수 표시)
const createMarkerIcon = (isSelected: boolean, count: number = 1) => {
  const showBadge = count > 1;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 32px;
          height: 32px;
          background: ${isSelected ? '#2563eb' : '#3b82f6'};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
        </div>
        ${showBadge ? `
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          ">${count}</div>
        ` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapEventsHandlerProps {
  onBoundsChange: (bounds: MapBounds) => void;
}

const MapEventsHandler = ({ onBoundsChange }: MapEventsHandlerProps) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        northEast: {
          lat: bounds.getNorthEast().lat,
          lng: bounds.getNorthEast().lng,
        },
        southWest: {
          lat: bounds.getSouthWest().lat,
          lng: bounds.getSouthWest().lng,
        },
      });
    },
  });

  return null;
};

interface FlyToLocationProps {
  lat: number;
  lng: number;
}

const FlyToLocation = ({ lat, lng }: FlyToLocationProps) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1 });
  }, [map, lat, lng]);

  return null;
};

interface MansionMapProps {
  mansions: Mansion[];
  groupedMansions?: Map<string, Mansion[]>;
  selectedMansion?: Mansion | null;
  onSelectMansion?: (mansion: Mansion) => void;
  onLocateUser?: () => void;
}

// 현재 위치 버튼 컴포넌트
interface LocateButtonProps {
  onLocate: (lat: number, lng: number) => void;
}

const LocateButton = ({ onLocate }: LocateButtonProps) => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 15, { duration: 1 });
        onLocate(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('現在地を取得できませんでした。位置情報の許可を確認してください。');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      style={{
        position: 'absolute',
        bottom: '120px',
        left: '10px',
        zIndex: 1000,
        width: '34px',
        height: '34px',
        backgroundColor: 'white',
        border: '2px solid rgba(0,0,0,0.2)',
        borderRadius: '4px',
        cursor: isLocating ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 5px rgba(0,0,0,0.4)'
      }}
      title="現在地を表示"
    >
      {isLocating ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32">
            <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
        </svg>
      )}
    </button>
  );
};

// 도쿄 중심 좌표
const TOKYO_CENTER = {
  lat: 35.6812,
  lng: 139.7671,
};

export const MansionMap = ({ mansions, groupedMansions, selectedMansion, onSelectMansion }: MansionMapProps) => {
  const { setMapBounds, selectedMansionId, setSelectedMansion } = useSearchStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      setMapBounds(bounds);
    },
    [setMapBounds]
  );

  const handleMarkerClick = useCallback(
    (mansion: Mansion) => {
      setSelectedMansion(mansion.id);
      onSelectMansion?.(mansion);
    },
    [setSelectedMansion, onSelectMansion]
  );

  const handleLocateUser = useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[TOKYO_CENTER.lat, TOKYO_CENTER.lng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler onBoundsChange={handleBoundsChange} />
        <LocateButton onLocate={handleLocateUser} />

        {selectedMansion && (
          <FlyToLocation lat={selectedMansion.latitude} lng={selectedMansion.longitude} />
        )}

        {/* 사용자 현재 위치 마커 */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={10}
            pathOptions={{
              fillColor: '#4285f4',
              fillOpacity: 1,
              color: 'white',
              weight: 3,
            }}
          >
            <Popup>現在地</Popup>
          </CircleMarker>
        )}

        {/* 좌표별로 하나의 마커만 표시 (복수 물건은 배지로 개수 표시) */}
        {groupedMansions ? (
          Array.from(groupedMansions.entries()).map(([key, mansionsAtLocation]) => {
            const firstMansion = mansionsAtLocation[0];
            const count = mansionsAtLocation.length;
            const isSelected = mansionsAtLocation.some(m => selectedMansionId === m.id);
            return (
              <Marker
                key={key}
                position={[firstMansion.latitude, firstMansion.longitude]}
                icon={createMarkerIcon(isSelected, count)}
                eventHandlers={{
                  click: () => handleMarkerClick(firstMansion),
                }}
              >
                <Popup>
                  <MansionPopup mansion={firstMansion} count={count} />
                </Popup>
              </Marker>
            );
          })
        ) : (
          mansions.map((mansion) => (
            <Marker
              key={mansion.id}
              position={[mansion.latitude, mansion.longitude]}
              icon={createMarkerIcon(selectedMansionId === mansion.id)}
              eventHandlers={{
                click: () => handleMarkerClick(mansion),
              }}
            >
              <Popup>
                <MansionPopup mansion={mansion} />
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};
