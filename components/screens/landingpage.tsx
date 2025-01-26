'use client';

import { Spotlight } from "@/components/ui/spotlight";
import ColourfulText from "@/components/ui/colourful-text";
import ColorPicker from "../ColorPicker/colorpicker";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react"

const LandingPage = () => {
    const { setTheme, theme } = useTheme()
    return (
        <>
            <div className="h-screen p-10 w-full md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="absolute right-4"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
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