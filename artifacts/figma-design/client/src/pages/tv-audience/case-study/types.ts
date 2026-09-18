export interface Hotspot {
  id: string;
  x: number; // 0-100
  y: number; // 0-100
  type: 'ISSUE' | 'WHY' | 'DECISION' | 'RESULT';
  title: string;
  content: string;
  region?: { left: number; top: number; width: number; height: number };
}

export interface Version {
  id: string;
  title: string;
  stage: string;
  screenshot: string;
  problem: string;
  exploration: string;
  evidence: string;
  decision: string;
  result: string;
  next: string;
  source: string;
  note: string;
  hotspots?: Hotspot[];
}

export interface KPI {
  id: string;
  title: string;
  question: string;
  metrics: string;
  dimensions: string;
  chart: string;
  interaction: string;
  rationale: string;
  result: string;
  status: string;
  note: string;
  sources: string[];
}

export interface Feedback {
  id: string;
  sourceNumber: string;
  requestedNumber: string;
  title: string;
  quote: string;
  problem: string;
  decision: string;
  visual: string;
  outcome: string;
  status: string;
  source: string;
}

export interface Source {
  id: string;
  title: string;
  reference: string;
  kind: string;
}

export interface UseCase {
  id: string;
  title: string;
  question: string;
  detail: string;
  kpis: string[];
}

export interface Evaluation {
  method: string;
  lookedFor: string;
  evidence: string;
  response: string;
  limitation: string;
}

export interface Outcome {
  title: string;
  detail: string;
}

export interface Learning {
  title: string;
  detail: string;
}

export interface InteractionStep {
  title: string;
  detail: string;
  note: string;
}

export interface Context {
  role: string;
  scope: string;
  timeline: string;
  users: string;
  markets: string;
  status: string;
}
