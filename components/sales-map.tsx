"use client"

import Image from "next/image";
import EpicDashboardCard from "@/components/dash-card";
import axios from "axios";
import { useEffect, useState } from "react";

export interface JobLocation {
    id: number;
    title: string;
    address: string;
}

interface Coordinates {
    lat: number;
    lng: number;
}

interface GeocodedLocation extends JobLocation, Coordinates {}

interface SalesMapProps {
    jobs: JobLocation[];
    title: string;
    zoomLevel?: number;
    mapWidth?: number;
    mapHeight?: number;
}

async function getCoordinates(address: string): Promise<Coordinates> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: address,
            key: apiKey
        }
    });

    if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return {
            lat: location.lat,
            lng: location.lng
        };
    } else {
        throw new Error('Geocoding failed: ' + response.data.status);
    }
}

export default function SalesMap({ 
    jobs,
    title = "Active Jobs Map",
    mapWidth = 800,
    mapHeight = 600
}: SalesMapProps) {
    const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [validLocations, setValidLocations] = useState<GeocodedLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function geocodeAddresses() {
            setIsLoading(true);
            const geocodedResults = await Promise.all(
                jobs.filter(job => job.address)
                    .map(async (job) => {
                        try {
                            const coords = await getCoordinates(job.address);
                            return {
                                ...job,
                                ...coords
                            };
                        } catch (error) {
                            console.error(`Failed to geocode address for job ${job.id}:`, error);
                            return null;
                        }
                    })
            );
            
            setValidLocations(geocodedResults.filter((loc): loc is GeocodedLocation => loc !== null));
            setIsLoading(false);
        }

        geocodeAddresses();
    }, [jobs]);

    const calculateBounds = (locations: GeocodedLocation[]) => {
        if (locations.length === 0) {
            // Default to Dallas-Fort Worth area if no valid coordinates
            return { 
                north: 32.7767, south: 32.7767, 
                east: -96.7970, west: -96.7970,
                center: { lat: 32.7767, lng: -96.7970 }
            };
        }

        let north = -90, south = 90, east = -180, west = 180;
        let sumLat = 0, sumLng = 0;

        locations.forEach(loc => {
            north = Math.max(north, loc.lat);
            south = Math.min(south, loc.lat);
            east = Math.max(east, loc.lng);
            west = Math.min(west, loc.lng);
            sumLat += loc.lat;
            sumLng += loc.lng;
        });

        return {
            north, south, east, west,
            center: {
                lat: sumLat / locations.length,
                lng: sumLng / locations.length
            }
        };
    };

    const bounds = calculateBounds(validLocations);

    if (!GOOGLE_MAPS_KEY) {
        console.error('Google Maps API key is not configured');
        return (
            <EpicDashboardCard
                title={title}
                content={
                    <div className="p-4 text-center text-red-500">
                        Map configuration error. Please check API key.
                    </div>
                }
                accentColor="from-red-400 via-red-200 to-white"
            />
        );
    }

    const markers = validLocations.map(job => (
        `markers=color:red%7Clabel:${job.id}%7C${job.lat},${job.lng}`
    )).join('&');

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?`
        + `center=${bounds.center.lat},${bounds.center.lng}`
        + `&size=${mapWidth}x${mapHeight}`
        + `&scale=2`
        + `&maptype=roadmap`
        + `&${markers}`
        + `&key=${GOOGLE_MAPS_KEY}`
        + `&visible=${bounds.south},${bounds.west}|${bounds.north},${bounds.east}`;

    const MapContent = (
        <div className="relative">
            <Image 
                src={mapUrl} 
                alt="Map of active jobs"
                width={mapWidth}
                height={mapHeight}
                className="rounded-lg w-full h-auto"
                unoptimized
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {validLocations.map(job => (
                    <div key={job.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {job.id}
                        </div>
                        <div>
                            <div className="font-medium">{job.title}</div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <EpicDashboardCard
            title={title}
            content={
                isLoading ? (
                    <div className="p-4 text-center">
                        Loading map...
                    </div>
                ) : MapContent
            }
        />
    );
}

