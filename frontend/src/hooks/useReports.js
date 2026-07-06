import { useMemo } from "react";

export function useReports(reports = []) {
  return useMemo(() => reports, [reports]);
}
