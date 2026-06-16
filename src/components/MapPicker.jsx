import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LIMA = [-12.0464, -77.0428]

// Extrae {lat,lng} de un link de Google Maps tipo ...?q=lat,lng
export function parseLatLng(mapsLink) {
  if (!mapsLink) return null
  const m = mapsLink.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (!m) return null
  const lat = parseFloat(m[1])
  const lng = parseFloat(m[2])
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
}

// Pin dorado con SVG (evita el problema de iconos de Leaflet con bundlers)
const pinIcon = L.divIcon({
  className: '',
  html: `<svg viewBox="0 0 24 24" width="34" height="34" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))">
    <path fill="#C2A45E" stroke="#4B3527" stroke-width="1.5" d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5" fill="#4B3527"/>
  </svg>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

export default function MapPicker({ onSelect, initial = null, height = 260 }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const hasInitial = initial && Number.isFinite(initial.lat) && Number.isFinite(initial.lng)
    const start = hasInitial ? [initial.lat, initial.lng] : LIMA

    const map = L.map(elRef.current, { scrollWheelZoom: false }).setView(start, hasInitial ? 16 : 12)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker(start, { draggable: true, icon: pinIcon }).addTo(map)
    markerRef.current = marker

    const emit = (latlng) => onSelectRef.current?.({ lat: latlng.lat, lng: latlng.lng })
    marker.on('dragend', () => emit(marker.getLatLng()))
    map.on('click', (e) => { marker.setLatLng(e.latlng); emit(e.latlng) })

    // Si no hay ubicación guardada, intenta centrar en la del usuario
    if (!hasInitial && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ll = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          map.setView([ll.lat, ll.lng], 15)
          marker.setLatLng([ll.lat, ll.lng])
        },
        () => {},
        { timeout: 5000 },
      )
    }

    const t = setTimeout(() => map.invalidateSize(), 250)
    return () => { clearTimeout(t); map.remove(); mapRef.current = null }
  }, [])

  return <div ref={elRef} style={{ height }} className="w-full rounded-xl overflow-hidden border-2 border-nk-arena z-0" />
}
