import { DocumentTemplate } from './types';

export const affidavitTemplate: DocumentTemplate = {
  id: '5',
  name: 'Affidavit',
  description: 'General purpose affidavit template',
  category: 'affidavit',
  fields: [
    {
      id: 'deponentName',
      label: 'Deponent Full Name',
      type: 'text',
      placeholder: 'Enter deponent full name',
      required: true,
    },
    {
      id: 'deponentAddress',
      label: 'Deponent Address',
      type: 'textarea',
      placeholder: 'Enter deponent complete address',
      required: true,
    },
    {
      id: 'deponentOccupation',
      label: 'Deponent Occupation',
      type: 'text',
      placeholder: 'Enter occupation',
      required: true,
    },
    {
      id: 'affidavitTitle',
      label: 'Affidavit Title',
      type: 'text',
      placeholder: 'E.g., "Change of Name", "Loss of Documents"',
      required: true,
    },
    {
      id: 'court',
      label: 'Court/Registry',
      type: 'text',
      placeholder: 'E.g., "High Court of Lagos State"',
      required: true,
    },
    {
      id: 'suitNumber',
      label: 'Suit Number (if applicable)',
      type: 'text',
      placeholder: 'Enter suit number or leave blank',
      required: false,
    },
    {
      id: 'statement1',
      label: 'Statement 1',
      type: 'textarea',
      placeholder: 'Enter first statement of fact',
      required: true,
    },
    {
      id: 'statement2',
      label: 'Statement 2',
      type: 'textarea',
      placeholder: 'Enter second statement of fact',
      required: true,
    },
    {
      id: 'statement3',
      label: 'Statement 3 (Optional)',
      type: 'textarea',
      placeholder: 'Enter third statement of fact',
      required: false,
    },
    {
      id: 'statement4',
      label: 'Statement 4 (Optional)',
      type: 'textarea',
      placeholder: 'Enter fourth statement of fact',
      required: false,
    },
    {
      id: 'statement5',
      label: 'Statement 5 (Optional)',
      type: 'textarea',
      placeholder: 'Enter fifth statement of fact',
      required: false,
    },
  ],
  generateContent: (data) => {
    const statements = [
      data.statement1,
      data.statement2,
      data.statement3,
      data.statement4,
      data.statement5,
    ].filter(s => s && s.trim());

    const statementsHtml = statements
      .map((stmt, idx) => `${idx + 1}. That ${stmt}`)
      .join('\n\n');

    return `
IN THE ${data.court.toUpperCase()}
${data.suitNumber ? `\nSUIT NO: ${data.suitNumber}\n` : ''}
IN THE MATTER OF: ${data.affidavitTitle.toUpperCase()}

AFFIDAVIT

I, ${data.deponentName.toUpperCase()}, of ${data.deponentAddress}, ${data.deponentOccupation}, do hereby make oath and state as follows:

${statementsHtml}

SWORN to at ________________________
this ______ day of _____________, 20___

Before me,

_______________________________
COMMISSIONER FOR OATHS/
NOTARY PUBLIC


_______________________________
${data.deponentName}
(Deponent's Signature)


DEPONENT'S INFORMATION:
Name: ${data.deponentName}
Address: ${data.deponentAddress}
Occupation: ${data.deponentOccupation}
Phone: _______________________
Email: _______________________


EXHIBIT(S) (if any):
Mark all exhibits as "Exhibit A", "Exhibit B", etc.

_________________________________________________________________
_________________________________________________________________
_________________________________________________________________


NOTARIAL FEE PAYMENT:
Receipt No: ___________________
Amount: ₦ ____________________
Date: ________________________


COMMISSIONER FOR OATHS DETAILS:
Name: _______________________________
Stamp: ______________________________
Date: _______________________________


NOTES:
1. This affidavit must be sworn before a Commissioner for Oaths, Notary Public, or a Magistrate.
2. The deponent must bring valid identification (National ID, International Passport, Driver's License, or Voter's Card).
3. All statements must be factual and within the deponent's personal knowledge.
4. False statements in an affidavit may constitute perjury and attract criminal penalties.
5. Exhibits referenced in the affidavit must be attached and properly marked.
`.trim();
  },
};
