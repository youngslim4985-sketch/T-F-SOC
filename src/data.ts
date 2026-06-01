import { Threat, Asset, DriftMetric, BugBounty } from './types';

export const mockThreats: Threat[] = [
  {
    id: '1',
    title: 'Anomalous SSH connection',
    severity: 'high',
    timestamp: new Date().toISOString(),
    status: 'active',
    source: 'Log Monitor',
    description: 'Multiple failed SSH attempts followed by successful login from unrecognized IP 192.168.5.12'
  },
  {
    id: '2',
    title: 'Potential SQL Injection',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'investigating',
    source: 'WAF',
    description: 'Malicious payload detected in search parameter on production checkout API'
  },
  {
    id: '3',
    title: 'Unauthorized S3 Bucket Access',
    severity: 'medium',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'resolved',
    source: 'CloudTrail',
    description: 'Public read access enabled on non-critical backup bucket "temp-logs-2024"'
  }
];

export const mockAssets: Asset[] = [
  { id: 'a1', hostname: 'prod-api-01', ip: '10.0.1.45', type: 'Server', exposureScore: 88, criticality: 'critical', lastMonitored: new Date().toISOString() },
  { id: 'a2', hostname: 'staging-db-02', ip: '10.0.2.12', type: 'Database', exposureScore: 35, criticality: 'medium', lastMonitored: new Date().toISOString() },
  { id: 'a3', hostname: 'user-vpn-gw', ip: '172.16.0.4', type: 'Gateway', exposureScore: 62, criticality: 'high', lastMonitored: new Date().toISOString() },
  { id: 'a4', hostname: 'corp-mail-svr', ip: '10.0.1.5', type: 'Server', exposureScore: 12, criticality: 'low', lastMonitored: new Date().toISOString() },
];

export const mockDrifts: DriftMetric[] = [
  { modelId: 'fraud-detect-v2', metricName: 'Precision', value: 0.82, threshold: 0.90, timestamp: new Date().toISOString(), isAnomalous: true, explanation: 'Input feature "avg_trans_value" has shifted out of trained distribution.' },
  { modelId: 'threat-classifier', metricName: 'Inference Confidence', value: 0.95, threshold: 0.85, timestamp: new Date().toISOString(), isAnomalous: false },
  { modelId: 'user-behavior-baseline', metricName: 'KL Divergence', value: 0.15, threshold: 0.20, timestamp: new Date().toISOString(), isAnomalous: false },
];

export const mockBounties: BugBounty[] = [
  { id: 'b1', programName: 'Public API v2', target: 'api.target.internal', reward: 5000, criticality: 'critical', bountyEfficiencyScore: 92, discoveryDate: new Date().toISOString() },
  { id: 'b2', programName: 'Internal SDK', target: '@internal/sdk', reward: 1500, criticality: 'medium', bountyEfficiencyScore: 45, discoveryDate: new Date().toISOString() },
  { id: 'b3', programName: 'Mobile App', target: 'T&F SOC+Offensive iOS', reward: 2500, criticality: 'high', bountyEfficiencyScore: 78, discoveryDate: new Date().toISOString() },
];
