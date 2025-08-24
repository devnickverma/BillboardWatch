import { z } from "zod";

export const insertReportSchema = z.object({
  imageUrl: z.string().url("Must be a valid image URL"),
  location: z.string().min(1, "Location is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  violationType: z.enum([
    "Unauthorized Content",
    "Illegal Placement", 
    "Size Violation",
    "Permit Expired"
  ]),
  description: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  timestamp: z.string().datetime()
});

export const reportSchema = insertReportSchema.extend({
  id: z.string(),
  status: z.enum(["Pending", "Under Review", "Resolved"]).default("Pending"),
  createdAt: z.string().datetime(),
  aiAnalysis: z.string().optional()
});

export const heatmapPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  intensity: z.number().min(0).max(1)
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = z.infer<typeof reportSchema>;
export type HeatmapPoint = z.infer<typeof heatmapPointSchema>;
