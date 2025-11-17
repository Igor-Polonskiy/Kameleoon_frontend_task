import Select from "react-select";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import styles from "./Header.module.scss";
import type { HeaderProps } from "./Header.types";
import { lineStyleOptions, timeFrameOptions} from "./constants";
import { useSelectStyles } from "./useStyles"
import type { LineStyle, TimeFrame } from "../../shared/types";

export function Header({
  variations,
  selectedVariations,
  onVariationChange,
  timeFrame,
  onTimeFrameChange,
  lineStyle,
  onLineStyleChange,
  onDownload,
  onZoomOut,
  onZoomIn,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

   const selectStyles = useSelectStyles();

 
  const variationOptions = variations.map(v => ({ value: v.id, label: v.name }));
  const selectedVariationOptions = variationOptions.filter(o =>
    selectedVariations.includes(o.value)
  );


  return (
    <div className={styles.header}>
      <div className={styles.control}>
        <label>Variations:</label>
        <Select
          styles={selectStyles}
          options={variationOptions}
          value={selectedVariationOptions}
          isMulti
          onChange={selected => {
            if (!selected || selected.length === 0) return;
            onVariationChange(
              selected.map(s => {
                if (typeof s.value === "number") return s.value;
                if (s.value === "0") return "0";
                return undefined;
              }).filter((v): v is number | "0" => v !== undefined)
            );
          }}
          classNamePrefix="react-select"
          isClearable={false}
        />
      </div>

      <div className={styles.headeritem}>

        <div className={styles.control}>
          <label>Time Frame:</label>
          <Select
            styles={selectStyles}
            options={timeFrameOptions}
            value={timeFrameOptions.find(o => o.value === timeFrame)}
            onChange={option => {
              if (!option || Array.isArray(option)) return;
              onTimeFrameChange((option as { value: TimeFrame }).value);
            }}
            classNamePrefix="react-select"
          />
        </div>

        <div className={styles.control}>
          <label>Line Style:</label>
          <Select
            styles={selectStyles}
            options={lineStyleOptions}
            value={lineStyleOptions.find(o => o.value === lineStyle)}
            onChange={option => {
              if (!option || Array.isArray(option)) return;
              onLineStyleChange((option as { value: LineStyle }).value);
            }}
            classNamePrefix="react-select"
          />
        </div>

        <div className={styles.control}>
          <label>Zoom:</label>
          <button className={`${styles.zoomButton} ${styles.theme}`} onClick={onZoomOut}>–</button>
          <button className={`${styles.zoomButton} ${styles.theme}`} onClick={onZoomIn}>+</button>
        </div>

        <div className={styles.control}>
          <button onClick={onDownload} className={`${styles.button} ${styles.theme}`}>
            💾 Download
          </button>
        </div>

        <div className={styles.control}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            <span className={theme === "dark" ? styles.sun : styles.moon}>
              {theme === "dark" ? "☀️" : "🌙"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
