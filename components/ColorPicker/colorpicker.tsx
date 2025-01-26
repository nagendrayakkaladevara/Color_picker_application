'use client';

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ColorPicker: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [colorInfo, setColorInfo] = useState<{
        hex: string;
        rgb: string;
        hsl: string;
    } | null>(null);
    const [pickedColors, setPickedColors] = useState<string[]>([]);
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const convertColorFormats = (r: number, g: number, b: number) => {
        // HEX
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;

        // RGB
        const rgb = `rgb(${r}, ${g}, ${b})`;

        // HSL
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);

        let h = 0, s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
            }
            h *= 60;
        }

        const hsl = `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

        return { hex, rgb, hsl };
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setImage(result);
                setColorInfo(null);
                setPickedColors([]);
                setCursorPosition(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setCursorPosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        });
    };

    const handleColorPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        try {
            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            const colorFormats = convertColorFormats(r, g, b);

            setColorInfo(colorFormats);
            setPickedColors(prev => {
                if (!prev.includes(colorFormats.hex)) {
                    return [...prev, colorFormats.hex];
                }
                return prev;
            });
        } catch (error) {
            console.error("Error picking color:", error);
        }
    };

    const copyToClipboard = (color: string) => {
        if (color) {
            navigator.clipboard.writeText(color);
        }
    };

    return (
        <Card className="w-fit mx-auto">
           
            <CardContent className='md:flex justify-around gap-10 block '>

                <div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-4"
                    />

                    {image && (
                        <div className="relative">
                            <img
                                ref={imageRef}
                                src={image}
                                alt="Uploaded"
                                className="max-w-full h-auto mb-4"
                                onLoad={(e) => {
                                    const canvas = canvasRef.current;
                                    const target = e.target as HTMLImageElement;
                                    if (canvas) {
                                        canvas.width = target.width;
                                        canvas.height = target.height;
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                            ctx.drawImage(target, 0, 0);
                                        }
                                    }
                                }}
                            />
                            <div className="absolute top-0 left-0 w-full h-full">
                                <canvas
                                    ref={canvasRef}
                                    onClick={handleColorPick}
                                    onMouseMove={handleMouseMove}
                                    className="absolute top-0 left-0 opacity-0 cursor-crosshair"
                                    style={{ width: '100%', height: '100%' }}
                                />
                                {cursorPosition && (
                                    <div
                                        className="absolute pointer-events-none border-2 border-white"
                                        style={{
                                            left: cursorPosition.x - 10,
                                            top: cursorPosition.y - 10,
                                            width: '20px',
                                            height: '20px',
                                            boxShadow: '0 0 0 1px black',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div>

                    {colorInfo && (
                        <div className="mt-4">
                            <Tabs defaultValue="hex" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="hex">HEX</TabsTrigger>
                                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="hex">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-12 h-12 border"
                                            style={{ backgroundColor: colorInfo.hex }}
                                        />
                                        <Input
                                            value={colorInfo.hex}
                                            readOnly
                                            className="flex-grow"
                                        />
                                        <Button onClick={() => copyToClipboard(colorInfo.hex)}>
                                            Copy
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="rgb">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-12 h-12 border"
                                            style={{ backgroundColor: colorInfo.hex }}
                                        />
                                        <Input
                                            value={colorInfo.rgb}
                                            readOnly
                                            className="flex-grow"
                                        />
                                        <Button onClick={() => copyToClipboard(colorInfo.rgb)}>
                                            Copy
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="hsl">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-12 h-12 border"
                                            style={{ backgroundColor: colorInfo.hex }}
                                        />
                                        <Input
                                            value={colorInfo.hsl}
                                            readOnly
                                            className="flex-grow"
                                        />
                                        <Button onClick={() => copyToClipboard(colorInfo.hsl)}>
                                            Copy
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    {pickedColors.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Picked Colors:</h3>
                            <div className="flex flex-wrap gap-2">
                                {pickedColors.map((color, index) => (
                                    <TooltipProvider key={index}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div
                                                    className="w-8 h-8 border cursor-pointer"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => copyToClipboard(color)}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{color}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ColorPicker;