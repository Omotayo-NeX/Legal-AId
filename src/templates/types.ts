export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: TemplateField[];
  generateContent: (data: Record<string, any>) => string;
}
