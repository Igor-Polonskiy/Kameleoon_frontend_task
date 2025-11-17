// data.types.ts
export interface Variation {
  id?: number;
  name: string;
}

export interface RawDataItem {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface RawData {
  variations: Variation[];
  data: RawDataItem[];
}
