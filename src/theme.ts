import { useColorScheme } from "react-native";

const light = {
  background: "#F4F6F8",
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#D1D5DB",
  primary: "#0F766E",
  onPrimary: "#FFFFFF",
  error: "#B91C1C",
  success: "#15803D",
  shadow: "#000000",
};

const dark: typeof light = {
  background: "#0B1220",
  card: "#111827",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
  border: "#374151",
  primary: "#2DD4BF",
  onPrimary: "#042F2E",
  error: "#F87171",
  success: "#4ADE80",
  shadow: "#000000",
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}
