'use client';

import { Spotlight } from "@/components/ui/spotlight";
import ColourfulText from "@/components/ui/colourful-text";
import { useRef, useState } from "react";
import ColorPicker from "../ColorPicker/colorpicker";

const LandingPage = () => {
    return (
        <>
            <div className="h-screen p-10 w-full md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <div className="h-full overflow-y-scroll">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="white"
                    />
                    <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
                            Find Your <ColourfulText text="Perfect Color" /> <br /> with a Click!
                        </h1>
                        <p className="mt-4 font-normal text-sm text-neutral-300 max-w-lg text-center mx-auto">
                            Upload your image, click on any point, and instantly uncover the HEX, RGB, and HSL codes of your desired color. 
                        </p>
                    </div>
                    <ColorPicker />
                </div>
            </div>
        </>
    )
}

export default LandingPage;