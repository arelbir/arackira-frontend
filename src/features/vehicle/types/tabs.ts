export interface TabDefinition {
  id: string;
  label: string;
  component: string;
  priority: number;
  requiredFields?: string[];
  visibleWhen?: (data: any) => boolean;
}

export interface TabError {
  [tabId: string]: string;
}
