"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("./Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <p>Loading garden sketch&hellip;</p>
    </div>
  ),
});

export default function CanvasLazyLoader() {
  return <Canvas />;
}