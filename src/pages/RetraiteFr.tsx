// src/pages/RetraiteFr.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, Calculator, TrendingUp, FileText, Users, DollarSign, Zap, Crown, 
  Lock, Database, AlertTriangle, ExternalLink, CheckCircle, XCircle,
  BarChart3, PieChart, Target, Briefcase, Home, Heart, Plane, Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../features/retirement/hooks/useLanguage';
import { translations } from '../features/retirement/translations';
import { RetirementNavigation } from '../features/retirement';

const RetraiteFr: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-navy via-mpr-navy-mid to-mpr-navy">
      {/* Navigation Phase 1 Intégrée */}
      <RetirementNavigation />
      







    </div>
  );
};

export default RetraiteFr;
