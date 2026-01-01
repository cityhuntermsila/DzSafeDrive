
export enum HazardType {
  PERSON = 'person',
  ANIMAL = 'animal',
  OBSTACLE = 'obstacle',
  VEHICLE = 'vehicle'
}

export enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface DetectionResult {
  type: HazardType;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  threatLevel: ThreatLevel;
  description: string;
}

export interface AnalysisResponse {
  risks: DetectionResult[];
  summary: string;
  alertNeeded: boolean;
}
