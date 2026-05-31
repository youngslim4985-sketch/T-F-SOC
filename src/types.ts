export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ThreatStatus = 'active' | 'investigating' | 'resolved';

export interface Threat {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  status: ThreatStatus;
  source: string;
  description: string;
  remediation?: string;
  riskScore?: number;
  summary?: string;
}

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  type: string;
  exposureScore: number;
  criticality: Severity;
  lastMonitored: string;
}

export interface DriftMetric {
  modelId: string;
  metricName: string;
  value: number;
  threshold: number;
  timestamp: string;
  isAnomalous: boolean;
  explanation?: string;
}

export interface BugBounty {
  id: string;
  programName: string;
  target: string;
  reward: number;
  criticality: Severity;
  bountyEfficiencyScore: number;
  discoveryDate: string;
}
