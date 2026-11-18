export type OilGrade = '0W-20' | '5W-30' | '10W-40' | '20W-50';

export interface EngineSimulationState {
  rpm: number; // 0 to 6500
  isRunning: boolean;
  temperature: number; // -20 to 130 °C
  oilGrade: OilGrade;
  filterClogged: boolean;
  filterClogPercent: number; // 0 to 100%
  oilLevel: number; // 0 to 100% (75% is max, 30% is min)
  oilPressure: number; // bar (0 to 6.5)
  oilFlowRate: number; // L/min (0 to 45)
  oilViscosityCst: number; // kinematic viscosity in cSt
  bypassValveOpen: boolean;
  reliefValveOpen: boolean;
  coolerActive: boolean;
  oilWarningLamp: boolean;
  selectedComponentId: string | null;
  speedMultiplier: number;
}

export interface LubricationComponent {
  id: string;
  nameMn: string;
  nameEn: string;
  category: 'sump' | 'pump' | 'filtration' | 'cooling' | 'distribution' | 'bearings' | 'valvetrain' | 'sensors';
  shortDesc: string;
  fullDescription: string;
  operationalPrinciples: string[];
  specs: {
    label: string;
    value: string;
  }[];
  failureModes: {
    symptom: string;
    cause: string;
    consequence: string;
  }[];
  maintenanceAdvice: string[];
  schematicCoords: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface LessonSection {
  title: string;
  paragraphs: string[];
  highlights?: string[];
  callout?: {
    type: 'info' | 'warning' | 'tip';
    title: string;
    text: string;
  };
}

export interface LessonChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  summary: string;
  sections: LessonSection[];
  interactiveGoal?: string;
  recommendedComponentId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: string;
}

export interface GlossaryTerm {
  mn: string;
  en: string;
  category: string;
  definition: string;
  example: string;
}
