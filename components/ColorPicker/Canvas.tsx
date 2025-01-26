"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>("#ffffff");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [zoom, setZoom] = useState<number>(1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          setIsImageLoaded(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / zoom);
      const y = Math.floor((e.clientY - rect.top) / zoom);
      const imageData = ctx?.getImageData(x, y, 1, 1).data;
      if (imageData) {
        const [r, g, b] = imageData;
        setColor(`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`);
      }
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => (direction === "in" ? Math.min(prev + 0.1, 5) : Math.max(prev - 0.1, 1)));
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {isImageLoaded && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border cursor-crosshair"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          ></canvas>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => handleZoom("in")} className="p-2 bg-blue-500 text-white rounded">Zoom In</Button>
            <button onClick={() => handleZoom("out")} className="p-2 bg-blue-500 text-white rounded">Zoom Out</button>
          </div>
        </div>
      )}
      <div className="mt-4">
        <p className="text-sm">Selected Color: <span className="font-bold">{color}</span></p>
        <div className="mt-2 w-16 h-16 border" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default Canvas;
