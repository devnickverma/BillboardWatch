import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import type { Report } from "@/types/report";

const getStatusVariant = (status: Report['status']) => {
  switch (status) {
    case "Pending":
      return "secondary";
    case "Under Review":
      return "default";
    case "Resolved":
      return "outline";
    default:
      return "secondary";
  }
};

const getViolationColor = (type: string) => {
  switch (type) {
    case "Unauthorized Content":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "Size Violation":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Illegal Placement":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Permit Expired":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function ReportsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports']
  });

  const filteredReports = reports?.filter(report =>
    report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.violationType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="border-border" data-testid="card-reports-table">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border" data-testid="card-reports-table">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Reports</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
              data-testid="input-search-reports"
            />
            <button className="text-muted-foreground hover:text-foreground" data-testid="button-filter">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-reports">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Violation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredReports?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground" data-testid="text-no-reports">
                    No reports found. Submit your first report above.
                  </td>
                </tr>
              ) : (
                filteredReports?.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/25 transition-colors" data-testid={`row-report-${report.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={report.imageUrl}
                        alt="Billboard report"
                        className="w-12 h-8 object-cover rounded border border-border"
                        data-testid={`img-report-${report.id}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" data-testid={`text-location-${report.id}`}>
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getViolationColor(report.violationType)}`}
                        data-testid={`badge-violation-${report.id}`}
                      >
                        {report.violationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(report.status)} data-testid={`badge-status-${report.id}`}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground" data-testid={`text-date-${report.id}`}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredReports && filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex justify-between items-center">
            <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
              Showing {filteredReports.length} of {reports?.length} results
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
