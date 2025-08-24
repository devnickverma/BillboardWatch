import { type Report, type InsertReport, type HeatmapPoint } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: string, status: Report['status']): Promise<Report | undefined>;
  getHeatmapData(): Promise<HeatmapPoint[]>;
  getReportStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    uniqueLocations: number;
  }>;
}

export class MemStorage implements IStorage {
  private reports: Map<string, Report>;

  constructor() {
    this.reports = new Map();
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getReportById(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const report: Report = {
      ...insertReport,
      id,
      status: "Pending",
      createdAt: now
    };
    this.reports.set(id, report);
    return report;
  }

  async updateReportStatus(id: string, status: Report['status']): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, status };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async getHeatmapData(): Promise<HeatmapPoint[]> {
    const reports = Array.from(this.reports.values());
    const locationCounts = new Map<string, number>();
    
    // Count reports by location
    reports.forEach(report => {
      const key = `${report.latitude.toFixed(4)},${report.longitude.toFixed(4)}`;
      locationCounts.set(key, (locationCounts.get(key) || 0) + 1);
    });
    
    const maxCount = Math.max(...locationCounts.values(), 1);
    
    return Array.from(locationCounts.entries()).map(([coords, count]) => {
      const [lat, lng] = coords.split(',').map(Number);
      return {
        lat,
        lng,
        intensity: count / maxCount
      };
    });
  }

  async getReportStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    uniqueLocations: number;
  }> {
    const reports = Array.from(this.reports.values());
    const uniqueLocations = new Set(
      reports.map(r => `${r.latitude},${r.longitude}`)
    ).size;
    
    return {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === "Pending" || r.status === "Under Review").length,
      resolvedReports: reports.filter(r => r.status === "Resolved").length,
      uniqueLocations
    };
  }
}

export const storage = new MemStorage();
