'use client';

import { Spotlight } from "@/components/ui/spotlight";
import ColourfulText from "@/components/ui/colourful-text";
import { useRef, useState } from "react";

const LandingPage = () => {
    return (
        <>
            <div className="h-[40rem] w-full  flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
                        The best <ColourfulText text="components" /> <br /> you will ever find
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                        Spotlight effect is a great way to draw attention to a specific part
                        of the page. Here, we are drawing the attention towards the text
                        section of the page. I don&apos;t know why but I&apos;m running out of
                        copy.
                    </p>
                </div>
              
            </div>
              {/* <ColorPicker /> */}
        </>
    )
}

const ColorPicker = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [color, setColor] = useState<string>("#ffffff");
    const [imageLoaded, setImageLoaded] = useState(false);

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
                    setImageLoaded(true);
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const imageData = ctx?.getImageData(x, y, 1, 1).data;
            if (imageData) {
                const [r, g, b] = imageData;
                setColor(`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Color Picker</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
            />
            {imageLoaded && (
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="border cursor-crosshair"
                ></canvas>
            )}
            <div className="mt-4">
                <p className="text-sm">Selected Color: <span className="font-bold">{color}</span></p>
                <div
                    className="mt-2 w-16 h-16 border"
                    style={{ backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};


export default LandingPage;