// 100% LOCAL METRICS SERVICE (Demo-only)
// All external integrations removed. No network calls. No references to Airtable in runtime behavior or UI.

export interface DashboardMetrics {
  leads: number;
  appointments: number;
  presentations: number;
  sales: number;
  conversionRate: number;
  coreFocus: string;
}

// Backward-compatibility type alias (do not surface "Airtable" in UI)
export type AirtableMetrics = DashboardMetrics;

// Demo metrics generator (static/local)
export const getDemoMetrics = (): AirtableMetrics => ({
  leads: 500,
  appointments: 250,
  presentations: 125,
  sales: 60,
  conversionRate: 12,
  coreFocus: "Improve presentation skills to increase conversion rates."
});

// Local "fetch" that simply returns demo metrics (no network)
export const fetchAirtableMetrics = async (_apiKey?: string, _baseId?: string, _tableName?: string): Promise<AirtableMetrics> => {
  // Intentionally ignore params — external services are not used.
  return Promise.resolve(getDemoMetrics());
};

// Simple auto-refresh helper (local timer)
export const setupAutoRefresh = (
  fetchData: () => Promise<AirtableMetrics>,
  setData: (data: AirtableMetrics) => void,
  interval: number
) => {
  const refreshData = async () => {
    try {
      const data = await fetchData();
      setData(data);
      // Optional: console.log('Metrics refreshed (local demo)');
    } catch (error) {
      // Optional: console.error('Auto-refresh failed (local demo):', error);
    }
  };

  // Run immediately
  refreshData();

  // Set interval
  const intervalId = setInterval(refreshData, interval);

  // Cleanup function
  return () => clearInterval(intervalId);
};
