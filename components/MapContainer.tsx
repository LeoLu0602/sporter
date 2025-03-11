'use client';

import { GOOGLE_MAPS_API_KEY } from '@/lib/utils';
import { APIProvider, Map, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export default function MapContainer({
    setLatLng,
    closeMap,
}: {
    setLatLng: (latLng: { lat: number; lng: number }) => void;
    closeMap: () => void;
}) {
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLat(position.coords.latitude);
                setUserLng(position.coords.longitude);
            });
        }
    }, []);

    function handleClick(e: MapMouseEvent) {
        if (e.detail.latLng) {
            setLatLng(e.detail.latLng);
            closeMap();
        }
    }

    if (!userLat || !userLng) {
        return <></>;
    }

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: userLat, lng: userLng }}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleClick}
            />
        </APIProvider>
    );
}
