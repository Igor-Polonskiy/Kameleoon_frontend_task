import { useRef, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";
import { LineChart } from "./components/LineChart/LineChart";
import dataJSON from "./data/data.json";
import { Header } from "./components/Header/Header";
import * as htmlToImage from 'html-to-image';
import styles from "./App.module.scss";

// Получаем все вариации из данных
const variations = (dataJSON.variations as any[]).map(v => ({
  id: v.id ?? "0",
  name: v.name
}));

export default function App() {
  const [selectedVariations, setSelectedVariations] = useState<(number | "0")[]>([variations[0].id]);
  const [timeFrame, setTimeFrame] = useState<"day" | "week">("day");
  const [lineStyle, setLineStyle] = useState<"line" | "smooth" | "area">("line");
  const chartRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 100));

  const handleVariationChange = (ids: (number | "0")[]) => {
    if (ids.length === 0) return;  
    setSelectedVariations(ids);
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const dataUrl = await htmlToImage.toPng(chartRef.current);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `chart-${new Date().toISOString()}.png`;
    link.click();
  };

  const handleZoomChange = (delta: number) => {
  setZoom(prev => Math.min(200, Math.max(100, prev + delta)));
};

  return (
    <ThemeProvider>
      <div className={styles.chartWrapper}>
        <Header
          variations={variations}
          selectedVariations={selectedVariations}
          onVariationChange={handleVariationChange}
          timeFrame={timeFrame}
          onDownload={handleDownload}
          onTimeFrameChange={setTimeFrame}
          lineStyle={lineStyle}
          onLineStyleChange={setLineStyle}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

      <div ref={chartRef}>
        <LineChart
          selectedVariations={selectedVariations.map(String)}
          timeFrame={timeFrame}
          lineStyle={lineStyle}
          height={400}
          zoom={zoom}
          onZoomChange={handleZoomChange}
        />
      </div>
      </div>
    </ThemeProvider>
  );
}
