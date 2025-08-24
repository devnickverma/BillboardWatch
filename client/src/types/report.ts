import type { Report as SharedReport } from "@shared/schema";

export type Report = SharedReport;

export interface ReportFormData {
  location: string;
  latitude: number;
  longitude: number;
  violationType: "Unauthorized Content" | "Illegal Placement" | "Size Violation" | "Permit Expired";
  description?: string;
  userId: string;
  file: File;
}
