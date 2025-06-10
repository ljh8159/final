import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/MapPage.module.css';
import proj4 from "proj4";
import maplibregl from 'maplibre-gl';

function geoJsonCoordsToLngLatArray(coords) {
  // EPSG:3857 정확한 정의
  const epsg3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
  const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  return coords[0].map(([x, y]) => {
    const [lng, lat] = proj4(epsg3857, wgs84, [x, y]);
    return [lng, lat]; // [경도, 위도]
  });
}

const MapPage = () => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    let map;
    let floodSourceData = null;

    // 지도 생성
    map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // 무료 OSM 스타일
      center: [128.3446, 36.1195],
      zoom: 12
    });
    mapRef.current = map;

    map.on('load', () => {
      // 침수흔적도 불러오기
      fetch('/flood/floodmap.json')
        .then(res => res.json())
        .then(data => {
          // 좌표 변환 (EPSG:3857 → WGS84)
          data.features.forEach(feature => {
            if (feature.geometry?.type === "Polygon") {
              feature.geometry.coordinates = [
                geoJsonCoordsToLngLatArray(feature.geometry.coordinates)
              ];
            }
          });
          floodSourceData = data;

          map.addSource('flood', {
            type: 'geojson',
            data: floodSourceData
          });

          map.addLayer({
            id: 'flood-layer',
            type: 'fill',
            source: 'flood',
            paint: {
              'fill-color': [
                'match',
                ['get', 'FLDN_GRD'],
                '1', '#ff0000',
                '2', '#ff8c00',
                '3', '#ffff00',
                '4', '#00c8ff',
                '5', '#0000ff',
                '#888888'
              ],
              'fill-opacity': 0.5,
              'fill-outline-color': '#333'
            }
          });
        });

      // 기존 마커 불러오기
      fetch('http://localhost:5000/reports')
        .then(res => res.json())
        .then(data => {
          data.forEach(report => {
            if (report.stage === 3) {
              new maplibregl.Marker()
                .setLngLat([report.lng, report.lat])
                .addTo(map);
            }
          });
        });

      // 지도 클릭 시 신고
      map.on('click', (e) => {
        const lngLat = e.lngLat;
        // 주소 변환 (Nominatim 등 외부 API 필요, 여기선 생략)
        setAddress(`경도: ${lngLat.lng}, 위도: ${lngLat.lat}`);

        if (!image) {
          alert("사진을 먼저 업로드 해주세요!");
          return;
        }

        const timestamp = new Date().toISOString();
        const formData = new FormData();
        formData.append('lat', lngLat.lat);
        formData.append('lng', lngLat.lng);
        formData.append('address', `경도: ${lngLat.lng}, 위도: ${lngLat.lat}`);
        formData.append('timestamp', timestamp);
        formData.append('image', image);

        fetch('http://localhost:5000/report', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            alert(data.message);
            if (data.status === "accept") {
              new maplibregl.Marker()
                .setLngLat([lngLat.lng, lngLat.lat])
                .addTo(map);
            }
            if (data.status === "redirect") {
              window.open("https://www.safekorea.go.kr/", "_blank");
            }
          });
      });
    });

    return () => {
      if (map) map.remove();
    };
    // eslint-disable-next-line
  }, [image]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📍 도로뚫이단 - 하수구 지도</h2>
      {/* 범례 */}
<div style={{
  display: 'flex',
  gap: '8px',
  margin: '10px 0',
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: '0.95em'
}}>
  <span style={{fontWeight: 'bold'}}>범례:</span>
  <span style={{display: 'flex', alignItems: 'center'}}>
    <span style={{
      display: 'inline-block', width: 14, height: 14, background: '#ff0000', marginRight: 3, border: '1px solid #333'
    }}></span> 1등급
  </span>
  <span style={{display: 'flex', alignItems: 'center'}}>
    <span style={{
      display: 'inline-block', width: 14, height: 14, background: '#ff8c00', marginRight: 3, border: '1px solid #333'
    }}></span> 2등급
  </span>
  <span style={{display: 'flex', alignItems: 'center'}}>
    <span style={{
      display: 'inline-block', width: 14, height: 14, background: '#ffff00', marginRight: 3, border: '1px solid #333'
    }}></span> 3등급
  </span>
  <span style={{display: 'flex', alignItems: 'center'}}>
    <span style={{
      display: 'inline-block', width: 14, height: 14, background: '#00c8ff', marginRight: 3, border: '1px solid #333'
    }}></span> 4등급
  </span>
  <span style={{display: 'flex', alignItems: 'center'}}>
    <span style={{
      display: 'inline-block', width: 14, height: 14, background: '#0000ff', marginRight: 3, border: '1px solid #333'
    }}></span> 5등급
  </span>
</div>
      <label>
        사진 업로드:&nbsp;
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
      </label>
      <div className={styles.mapArea}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
      <p>🗺️ 현재 클릭한 주소: <strong>{address}</strong></p>
    </div>
  );
};

export default MapPage;