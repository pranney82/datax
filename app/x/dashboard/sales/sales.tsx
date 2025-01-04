"use client"

import SalesLineOne from "./saleslineone";
import SalesLineTwo from "./saleslinetwo";
import SalesTable from "./salestable";
import { SalesBlock1 } from "./salesblock1";
import { SalesBlock2 } from "./salesblock2";
import { SalesBlock3 } from "./salesblock3";
import { SalesBlock4 } from "./salesblock4";
import { SalesBlock5 } from "./salesblock5";

export default function Sales() {
    return (
        <div className="flex flex-col gap-4">
            {/* Top row */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                <SalesBlock1 />
                <SalesBlock2 />
                <SalesBlock3 />
                <SalesBlock4 />
                <SalesBlock5 />
            </div>

            {/* Second row */}
            <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <SalesLineOne />
                    </div>
                    <div className="md:col-span-3">
                        <SalesLineTwo />
                    </div>
            </div>

            {/* Third row */}
            <div className="grid gap-4 md:grid-cols-6">
                <div className="md:col-span-6">
                    <SalesTable />
                </div>
            </div>
        </div>
    );
}
