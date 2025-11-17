// useSelectStyles.ts
import { useTheme } from "../ThemeProvider/ThemeProvider";
import type { StylesConfig } from "react-select";

type OptionType = { value: string | number; label: string };

export const useSelectStyles = (): StylesConfig<OptionType, boolean> => {
  const { theme } = useTheme();

  return {
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#222" : "#fff",
      borderColor: theme === "dark" ? "#444" : "#ccc",
      color: theme === "dark" ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#222" : "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark" ? "#333" : "#eee"
        : theme === "dark" ? "#222" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#555" : "#ddd",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000",
    }),
  };
};
