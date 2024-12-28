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
    zoomLevel?: number;
    mapWidth?: number;
    mapHeight?: number;
}

export default function SalesMap({ 
    jobs,
    title = "Active Jobs Map",
    zoomLevel = 10,
    mapWidth = 800,
    mapHeight = 600
}: SalesMapProps) {
    const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Calculate center point from all coordinates
    const calculateCenter = (locations: JobLocation[]) => {
        // Filter out invalid coordinates (0,0 or null/undefined)
        const validLocations = locations.filter(loc => 
            loc.lat !== 0 && loc.lng !== 0 && 
            loc.lat !== undefined && loc.lng !== undefined
        );

        if (validLocations.length === 0) {
            // Default to Dallas-Fort Worth area if no valid coordinates
            return { lat: 32.7767, lng: -96.7970 };
        }
        
        const sum = validLocations.reduce((acc, loc) => ({
            lat: acc.lat + loc.lat,
            lng: acc.lng + loc.lng
        }), { lat: 0, lng: 0 });

        return {
            lat: sum.lat / validLocations.length,
            lng: sum.lng / validLocations.length
        };
    };

    const center = calculateCenter(jobs);

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
        + `center=${center.lat},${center.lng}`
        + `&zoom=${zoomLevel}`
        + `&size=${mapWidth}x${mapHeight}`
        + `&scale=2`
        + `&maptype=roadmap`
        + `&${markers}`
        + `&key=${GOOGLE_MAPS_KEY}`;

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