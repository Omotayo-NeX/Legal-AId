import { DocumentTemplate } from './types';
import { tenancyAgreementTemplate } from './tenancy-agreement';
import { ndaAgreementTemplate } from './nda-agreement';
import { employmentContractTemplate } from './employment-contract';
import { loanAgreementTemplate } from './loan-agreement';
import { affidavitTemplate } from './affidavit';
import { powerOfAttorneyTemplate } from './power-of-attorney';

export * from './types';

export const templates: Record<string, DocumentTemplate> = {
  '1': tenancyAgreementTemplate,
  '2': ndaAgreementTemplate,
  '3': employmentContractTemplate,
  '4': loanAgreementTemplate,
  '5': affidavitTemplate,
  '6': powerOfAttorneyTemplate,
};

export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return templates[id];
};

export const getAllTemplates = (): DocumentTemplate[] => {
  return Object.values(templates);
};

export const getTemplatesByCategory = (category: string): DocumentTemplate[] => {
  return Object.values(templates).filter(
    (template) => template.category === category
  );
};
