interface ColorInfoProps {
    color: string;
  }
  
  const ColorInfo: React.FC<ColorInfoProps> = ({ color }) => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.substring(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgb(${r}, ${g}, ${b})`;
    };
  
    const hexToHsl = (hex: string) => {
      const bigint = parseInt(hex.substring(1), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;
  
      if (max !== min) {
        const diff = max - min;
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
        h = max === r ? (g - b) / diff + (g < b ? 6 : 0) : max === g ? (b - r) / diff + 2 : (r - g) / diff + 4;
        h /= 6;
      }
      return `hsl(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
    };
  
    return (
      <div className="mt-4">
        <p>HEX: {color}</p>
        <p>RGB: {hexToRgb(color)}</p>
        <p>HSL: {hexToHsl(color)}</p>
      </div>
    );
  };
  
  export default ColorInfo;
  