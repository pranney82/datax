import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Sample job data with coordinates (centered around Dallas-Fort Worth area)
const activeJobs = [
    { id: 1, lat: 32.7767, lng: -96.7970, title: "Commercial Repair", address: "Downtown Dallas" },
    { id: 2, lat: 32.7555, lng: -96.8245, title: "Residential Installation", address: "Oak Cliff" },
    { id: 3, lat: 32.8121, lng: -96.7498, title: "Emergency Service", address: "Lake Highlands" },
    { id: 4, lat: 32.9115, lng: -96.7600, title: "Maintenance", address: "Richardson" },
    { id: 5, lat: 32.7473, lng: -97.0945, title: "Commercial Install", address: "Arlington" },
    { id: 6, lat: 33.0198, lng: -96.6989, title: "Inspection", address: "Plano" },
    { id: 7, lat: 32.9483, lng: -96.7299, title: "Emergency Repair", address: "North Dallas" },
    { id: 8, lat: 32.8508, lng: -96.8519, title: "Residential Service", address: "Love Field" },
    { id: 9, lat: 32.7937, lng: -96.7662, title: "Commercial Service", address: "East Dallas" },
    { id: 10, lat: 32.8577, lng: -96.9700, title: "Installation", address: "Las Colinas" },
    { id: 11, lat: 33.0247, lng: -96.8347, title: "Maintenance", address: "Frisco" },
    { id: 12, lat: 32.7112, lng: -97.2872, title: "Emergency Call", address: "Fort Worth" },
];

// Map configuration
const CENTER_LAT = 32.7767;
const CENTER_LNG = -96.7970;
const ZOOM_LEVEL = 10;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// Your Google Maps API key should be in your environment variables
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ActiveJobsMap() {
    // Add error handling for missing API key
    if (!GOOGLE_MAPS_KEY) {
        console.error('Google Maps API key is not configured');
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Jobs Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 text-center text-red-500">
                        Map configuration error. Please check API key.
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Create the markers string for the Google Static Maps API
    const markers = activeJobs.map(job => (
        `markers=color:red%7Clabel:${job.id}%7C${job.lat},${job.lng}`
    )).join('&');

    // Construct the Google Static Maps URL
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?`
        + `center=${CENTER_LAT},${CENTER_LNG}`
        + `&zoom=${ZOOM_LEVEL}`
        + `&size=${MAP_WIDTH}x${MAP_HEIGHT}`
        + `&scale=2` // Retina display support
        + `&maptype=roadmap`
        + `&${markers}`
        + `&key=${GOOGLE_MAPS_KEY}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Jobs Map</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <Image 
                        src={mapUrl} 
                        alt="Map of active jobs"
                        width={MAP_WIDTH}
                        height={MAP_HEIGHT}
                        className="rounded-lg w-full h-auto"
                        unoptimized // Add this to bypass Next.js image optimization for external URLs
                    />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {activeJobs.map(job => (
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
