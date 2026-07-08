export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const AVATAR_COLORS = {
  1: "#2563EB",
  2: "#10B981",
  3: "#8B5CF6",
  4: "#F59E0B",
  5: "#EF4444",
  6: "#6366F1",
  7: "#0EA5E9",
  8: "#D97706",
};