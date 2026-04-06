export interface Dataset {
  id: string;
  name: string;
  type: 'CSV' | 'Model Weights' | 'Image Set';
  size: string;
  price: string;
  description: string;
}

export interface NetworkMetrics {
  throughput: number;
  health: number;
}

export interface ROIResult {
  monthlyReturn: number;
  annualROI: number;
}

export interface NodeLatency {
  node: string;
  latency: number;
}
