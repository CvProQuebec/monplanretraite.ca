import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { UserData } from '@/types';
import { PopulationBenchmarkService, BenchmarkComparison } from '@/services/PopulationBenchmarkService';

interface LongevityComparisonsProps {
  userData: UserData;
  userLifeExpectancy: number;
  isFrench: boolean;
  personNumber: 1 | 2;
}

const LongevityComparisons: React.FC<LongevityComparisonsProps> = ({
  userData,
  userLifeExpectancy,
  isFrench,
  personNumber
}) => {
  const comparisonData = useMemo(() => {
    return PopulationBenchmarkService.generateBenchmarkComparison(
      userData,
      userLifeExpectancy,
      isFrench
    );
  }, [userData, userLifeExpectancy, isFrench]);

  const provincialRankings = useMemo(() => {
    return PopulationBenchmarkService.getProvincialRankings();
  }, []);

  const percentileData = useMemo(() => {
    const provinceCode = userData.personal?.province || 'QC';
    const benchmark = PopulationBenchmarkService.getProvincialBenchmark(provinceCode);

    if (!benchmark) return [];

    return [
      {
        percentile: '25th',
        value: benchmark.percentiles.p25,
        label: isFrench ? '25e percentile' : '25th percentile'
      },
      {
        percentile: '50th',
        value: benchmark.percentiles.p50,
        label: isFrench ? '50e percentile (Médiane)' : '50th percentile (Median)'
      },
      {
        percentile: '75th',
        value: benchmark.percentiles.p75,
        label: isFrench ? '75e percentile' : '75th percentile'
      },
      {
        percentile: '90th',
        value: benchmark.percentiles.p90,
        label: isFrench ? '90e percentile' : '90th percentile'
      },
      {
        percentile: '95th',
        value: benchmark.percentiles.p95,
        label: isFrench ? '95e percentile' : '95th percentile'
      },
      {
        percentile: 'User',
        value: userLifeExpectancy,
        label: isFrench ? 'Votre espérance' : 'Your expectancy',
        isUser: true
      }
    ];
  }, [userData, userLifeExpectancy, isFrench]);

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return '#10B981'; // Green
    if (percentile >= 75) return '#3B82F6'; // Blue
    if (percentile >= 50) return '#F59E0B'; // Yellow
    if (percentile >= 25) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 90) return <Award className="w-4 h-4" />;
    if (percentile >= 75) return <TrendingUp className="w-4 h-4" />;
    if (percentile >= 50) return <Target className="w-4 h-4" />;
    if (percentile >= 25) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getPercentileDescription = (percentile: number) => {
    if (isFrench) {
      if (percentile >= 90) return 'Excellent - Au-dessus de 90% de la population';
      if (percentile >= 75) return 'Très bon - Au-dessus de 75% de la population';
      if (percentile >= 50) return 'Bon - Au-dessus de la moyenne provinciale';
      if (percentile >= 25) return 'Moyen - En dessous de la moyenne';
      return 'À améliorer - Signficativement en dessous de la moyenne';
    } else {
      if (percentile >= 90) return 'Excellent - Above 90% of population';
      if (percentile >= 75) return 'Very Good - Above 75% of population';
      if (percentile >= 50) return 'Good - Above provincial average';
      if (percentile >= 25) return 'Average - Below provincial average';
      return 'Needs Improvement - Significantly below average';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.label}</p>
          <p className="text-mpr-interactive">
            {isFrench ? 'Espérance de vie:' : 'Life expectancy:'} {data.value.toFixed(1)} {isFrench ? 'ans' : 'years'}
          </p>
          {data.isUser && (
            <p className="text-green-600 font-medium">
              {isFrench ? 'Votre position' : 'Your position'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          {isFrench ? 'Comparaisons Provinciales' : 'Provincial Comparisons'}
        </h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {isFrench ? 'Analyse Comparative' : 'Comparative Analysis'}
        </Badge>
      </div>

      {/* Main Comparison Card */}
      <Card className="bg-gradient-to-r from-mpr-interactive-lt to-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="text-lg text-mpr-navy flex items-center gap-2">
            {getPercentileIcon(comparisonData.percentileRank)}
            {isFrench ? 'Votre Position Relative' : 'Your Relative Position'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Percentile Rank */}
            <div className="text-center">
              <div className="text-3xl font-bold text-mpr-navy mb-2">
                {comparisonData.percentileRank.toFixed(0)}th
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isFrench ? 'Percentile' : 'Percentile'}
              </div>
              <Progress
                value={comparisonData.percentileRank}
                className="w-full h-3"
              />
              <div className="text-xs text-gray-500 mt-1">
                {getPercentileDescription(comparisonData.percentileRank)}
              </div>
            </div>

            {/* Benchmark Gap */}
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                comparisonData.benchmarkGap >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {comparisonData.benchmarkGap >= 0 ? '+' : ''}{comparisonData.benchmarkGap.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isFrench ? 'Écart vs Moyenne' : 'Gap vs Average'}
              </div>
              <div className="flex items-center justify-center gap-1">
                {comparisonData.benchmarkGap >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs text-gray-500">
                  {isFrench ? 'années' : 'years'}
                </span>
              </div>
            </div>

            {/* Provincial Average */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {comparisonData.provincialAverage.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isFrench ? 'Moyenne Provinciale' : 'Provincial Average'}
              </div>
              <div className="text-xs text-gray-500">
                {userData.personal?.province || 'QC'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Percentile Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Distribution des Percentiles' : 'Percentile Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={percentileData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="percentile" />
              <YAxis label={{ value: isFrench ? 'Espérance de vie (ans)' : 'Life expectancy (years)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {percentileData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isUser ? '#10B981' : '#8884d8'}
                  />
                ))}
              </Bar>
              <ReferenceLine
                y={comparisonData.provincialAverage}
                stroke="#EF4444"
                strokeDasharray="5 5"
                label={{ value: isFrench ? 'Moyenne' : 'Average', position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Provincial Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Classement Provincial' : 'Provincial Rankings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {provincialRankings.slice(0, 5).map((province, index) => (
              <div key={province.provinceCode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    province.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    province.rank === 2 ? 'bg-gray-400 text-gray-900' :
                    province.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-mpr-interactive-lt text-mpr-navy'
                  }`}>
                    {province.rank}
                  </div>
                  <div>
                    <div className="font-medium">{province.province}</div>
                    <div className="text-sm text-gray-500">
                      {province.lifeExpectancy.toFixed(1)} {isFrench ? 'ans' : 'years'}
                    </div>
                  </div>
                </div>
                {province.provinceCode === (userData.personal?.province || 'QC') && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {isFrench ? 'Votre province' : 'Your province'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {comparisonData.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {isFrench ? 'Recommandations Personnalisées' : 'Personalized Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comparisonData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {comparisonData.riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {isFrench ? 'Facteurs de Risque Identifiés' : 'Identified Risk Factors'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comparisonData.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-800">
            {isFrench ? 'Résumé des Comparaisons' : 'Comparison Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-mpr-navy">
                {comparisonData.percentileRank.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Position' : 'Position'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {provincialRankings.find(p => p.provinceCode === (userData.personal?.province || 'QC'))?.rank || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Rang Provincial' : 'Provincial Rank'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {comparisonData.recommendations.length}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Recommandations' : 'Recommendations'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">
                {comparisonData.riskFactors.length}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Risques' : 'Risks'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongevityComparisons;
