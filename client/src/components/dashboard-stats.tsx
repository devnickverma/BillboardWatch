import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle, MapPin } from "lucide-react";

interface StatsData {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  uniqueLocations: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats']
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-border" data-testid="card-total-reports">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-accent w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-semibold text-foreground" data-testid="text-total-reports">
                {stats?.totalReports || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border" data-testid="card-pending-reports">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="text-yellow-500 w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-semibold text-foreground" data-testid="text-pending-reports">
                {stats?.pendingReports || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border" data-testid="card-resolved-reports">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="text-green-500 w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Resolved</p>
              <p className="text-2xl font-semibold text-foreground" data-testid="text-resolved-reports">
                {stats?.resolvedReports || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border" data-testid="card-locations">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="text-primary w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Locations</p>
              <p className="text-2xl font-semibold text-foreground" data-testid="text-locations">
                {stats?.uniqueLocations || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
