import SalesMap, { JobLocation } from "@/components/sales-map";

// Sample job data
const activeJobs: JobLocation[] = [
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

export default function ActiveJobsMap() {
    return <SalesMap jobs={activeJobs} />;
}
