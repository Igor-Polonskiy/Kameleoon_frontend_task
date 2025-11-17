import type { LineStyle, TimeFrame } from "../../shared/types";

export interface Variation {
  id: number | "0"; 
  name: string;
}

export interface HeaderProps {
  variations: Variation[];
  selectedVariations: (number | "0")[];
  onVariationChange: (selected: (number | "0")[]) => void;
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  onDownload: () => void;     
  zoom: number;                 
  onZoomIn: () => void;      
  onZoomOut: () => void;     
}
