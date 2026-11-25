'use client';

import { MapContainer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './VenueMap.module.css';

const markerIcon = L.divIcon({
    className: styles.marker,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

interface Venue {
    name: string;
    north: number;
    east: number;
    description: string;
}

export default function VenueMap({ venues }: { venues: Venue[] }) {
    return (
        <MapContainer
            crs={L.CRS.Simple}
            center={[0, 0]}
            zoom={0}
            minZoom={-1}
            maxZoom={2}
            maxBounds={[[-180, -220], [180, 220]]}
            className={styles.mapContainer}
            scrollWheelZoom={false}
            attributionControl={false}
        >
            {venues.map((venue) => (
                <Marker key={venue.name} position={[venue.north, venue.east]} icon={markerIcon} title={venue.name} alt={venue.name}>
                    <Tooltip permanent direction="bottom" offset={[0, 6]}>{venue.name}</Tooltip>
                    <Popup>
                        <div className={styles.popupTitle}>{venue.name}</div>
                        <div className={styles.popupDesc}>{venue.description}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
