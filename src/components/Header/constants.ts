import type { LineStyle, TimeFrame } from "../../shared/types";

export interface SelectOption<T> {
  value: T;
  label: string;
}

export const timeFrameOptions: SelectOption<TimeFrame>[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

export const lineStyleOptions: SelectOption<LineStyle>[] = [
  { value: "line", label: "Line" },
  { value: "smooth", label: "Smooth" },
  { value: "area", label: "Area" },
];