import { BadgeDollarSign, Bell, Settings, User } from "lucide-react";
import DashboardStats from "@/components/dashboard-stats";
import ReportForm from "@/components/report-form";
import ReportsTable from "@/components/reports-table";
import MapView from "@/components/map-view";
import PrivacyDisclaimer from "@/components/privacy-disclaimer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BadgeDollarSign className="text-primary text-2xl mr-3" data-testid="icon-billboard" />
                <span className="text-xl font-semibold text-foreground" data-testid="text-title">BadgeDollarSign Compliance</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-notifications">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-settings">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center" data-testid="avatar-user">
                <span className="text-primary-foreground text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Statistics */}
        <DashboardStats />

        {/* Report Submission Form */}
        <ReportForm />

        {/* Reports Table and Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReportsTable />
          <MapView />
        </div>

        {/* Privacy Disclaimer */}
        <PrivacyDisclaimer />
      </div>
    </div>
  );
}
