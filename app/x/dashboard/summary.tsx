import { Block1 } from "./summary-tiles/block1";
import { Block2 } from "./summary-tiles/block2";
import { Block3 } from "./summary-tiles/block3";
import { Block4 } from "./summary-tiles/block4";
import { Block5 } from "./summary-tiles/block5";
import { Block6 } from "./summary-tiles/block6";
import { Block7 } from "./summary-tiles/block7";
import { Block8 } from "./summary-tiles/block8";

export default function Summary() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top metrics row */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <Block1 />
        <Block2 />
        <Block3 />
        <Block4 />
        <Block5 />
      </div>

      {/* Monthly stats and chart */}
      <div className="grid gap-4 md:grid-cols-6 items-start">
        <div className="md:col-span-3">
          <Block6 />
        </div>
        <div className="md:col-span-3 grid gap-4">
          <Block7 />
          <Block8 />
        </div>
      </div>
    </div>
  );
}