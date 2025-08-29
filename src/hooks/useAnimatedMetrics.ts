
import { useState, useEffect } from "react";
import { AirtableMetrics } from "@/services/airtableService";

export const useAnimatedMetrics = (metrics: AirtableMetrics, loading: boolean) => {
  const [animatedMetrics, setAnimatedMetrics] = useState({
    leads: 0,
    appointments: 0,
    presentations: 0,
    sales: 0,
    conversionRate: 0
  });

  // Animate numbers counting up
  useEffect(() => {
    if (!loading && metrics.leads > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60fps
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        setAnimatedMetrics({
          leads: Math.round(metrics.leads * easeProgress),
          appointments: Math.round(metrics.appointments * easeProgress),
          presentations: Math.round(metrics.presentations * easeProgress),
          sales: Math.round(metrics.sales * easeProgress),
          conversionRate: Math.round(metrics.conversionRate * easeProgress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedMetrics({
            leads: metrics.leads,
            appointments: metrics.appointments,
            presentations: metrics.presentations,
            sales: metrics.sales,
            conversionRate: metrics.conversionRate
          });
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [loading, metrics]);

  return animatedMetrics;
};
