import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface JobLocation {
    id: number;
    lat: number;
    lng: number;
    title: string;
    address: string;
}

interface SalesMapProps {
    jobs: JobLocation[];
    title?: string;
    mapWidth?: number;
    mapHeight?: number;
}

export default function SalesMap({ 
    jobs,
    title = "Active Jobs Map",
    mapWidth = 800,
    mapHeight = 600
}: SalesMapProps) {
    const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const calculateBounds = (locations: JobLocation[]) => {
        const validLocations = locations.filter(loc => 
            loc.lat !== 0 && loc.lng !== 0 && 
            loc.lat !== undefined && loc.lng !== undefined
        );

        if (validLocations.length === 0) {
            // Default to Dallas-Fort Worth area if no valid coordinates
            return { 
                north: 32.7767, south: 32.7767, 
                east: -96.7970, west: -96.7970,
                center: { lat: 32.7767, lng: -96.7970 }
            };
        }

        let north = -90, south = 90, east = -180, west = 180;
        let sumLat = 0, sumLng = 0;

        validLocations.forEach(loc => {
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
                lat: sumLat / validLocations.length,
                lng: sumLng / validLocations.length
            }
        };
    };

    const bounds = calculateBounds(jobs);

    if (!GOOGLE_MAPS_KEY) {
        console.error('Google Maps API key is not configured');
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 text-center text-red-500">
                        Map configuration error. Please check API key.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const markers = jobs.map(job => (
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
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
                        {jobs.map(job => (
                            <div key={job.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {job.id}
                                </div>
                                <div>
                                    <div className="font-medium">{job.title}</div>
                                    <div className="text-gray-500">{job.address}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

