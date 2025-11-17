import type { LineStyle, TimeFrame } from "../../shared/types";

export interface Variation {
  id?: number;
  name: string;
}


export interface ProcessedData {
  date: string;
  variation: number | "0";   
  visits: number;             
  conversions: number;        
  conversionRate: number;     
}


export interface VisitsConversions {
  [key: string]: number;
}

export interface RawItem {
  date: string;
  visits?: VisitsConversions;
  conversions?: VisitsConversions;
}

export interface ChartDataItem {
  date: string;
  [key: string]: string | number | null;
}

export interface LineChartProps {
  selectedVariations: string[];
  timeFrame: TimeFrame;
  lineStyle: LineStyle;
  height?: number;
  zoom?: number;
  onZoomChange: (delta: number) => void;
}