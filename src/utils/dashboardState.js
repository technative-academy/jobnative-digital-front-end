export const DEFAULT_DASHBOARD_COLUMN = "todo";

export const DASHBOARD_COLUMNS = [
  {
    value: "favourite",
    label: "Favourites",
    shortLabel: "Favourite",
    description: "Companies you want to keep especially close.",
    emptyDescription: "Save companies here when you want quick access later.",
  },
  {
    value: "todo",
    label: "To Do",
    shortLabel: "To do",
    description: "Companies you plan to research or approach.",
    emptyDescription: "Nothing queued yet. Add a company from the directory.",
  },
  {
    value: "contacted",
    label: "Contacted",
    shortLabel: "Contacted",
    description: "Companies you have already messaged or applied to.",
    emptyDescription: "Move companies here after you have reached out.",
  },
];

export function getDashboardColumnMeta(column) {
  return (
    DASHBOARD_COLUMNS.find((item) => item.value === column) ??
    DASHBOARD_COLUMNS.find((item) => item.value === DEFAULT_DASHBOARD_COLUMN)
  );
}

export function normalizeDashboardNotes(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
