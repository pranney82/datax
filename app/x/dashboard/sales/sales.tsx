"use client"

import SalesLineOne from "./saleslineone"
import SalesLineTwo from "./saleslinetwo"
import SalesTable from "./salestable"
import { SalesBlock1 } from "./salesblock1"
import { SalesBlock2 } from "./salesblock2"
import { SalesBlock3 } from "./salesblock3"
import { SalesBlock4 } from "./salesblock4"
import { SalesBlock5 } from "./salesblock5"
import FeatureProtect from "@/components/admin/featureProtect"

export default function Sales() {
    return (
        <FeatureProtect featureName="Sales Dashboard">
        <div className="flex flex-col gap-4">
            {/* Top row */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <SalesBlock1 />
                <SalesBlock2 />
                <SalesBlock3 />
                <SalesBlock4 />
                <SalesBlock5 />
            </div>

            {/* Second row */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-5">
                    <SalesLineOne />
                </div>
            </div>

            {/* Third row */}
            <div className="grid gap-4">
                <div className="col-span-full">
                    <SalesLineTwo />
                </div>
            </div>

            {/* Fourth row */}
            <div className="grid gap-4">
                <div className="col-span-full">
                    <SalesTable />
                </div>
            </div>
        </div>
        </FeatureProtect>
    )
}

