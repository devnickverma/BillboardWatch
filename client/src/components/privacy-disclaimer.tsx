import { Info } from "lucide-react";

export default function PrivacyDisclaimer() {
  return (
    <div className="mt-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6" data-testid="section-privacy-disclaimer">
      <div className="flex items-start">
        <Info className="text-blue-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Privacy Notice
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            All submitted reports and images are used solely for billboard compliance monitoring and enforcement purposes. 
            Location data is anonymized after processing. Images may be shared with relevant authorities for violation investigations. 
            By submitting a report, you consent to these terms. For questions about data usage, contact{" "}
            <a 
              href="mailto:privacy@billboardcompliance.gov" 
              className="underline hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
              data-testid="link-privacy-email"
            >
              privacy@billboardcompliance.gov
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
