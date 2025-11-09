import { DocumentTemplate } from './types';

export const ndaAgreementTemplate: DocumentTemplate = {
  id: '2',
  name: 'Non-Disclosure Agreement',
  description: 'Mutual NDA for business discussions',
  category: 'business',
  fields: [
    {
      id: 'party1Name',
      label: 'First Party Name',
      type: 'text',
      placeholder: 'Enter first party name',
      required: true,
    },
    {
      id: 'party1Address',
      label: 'First Party Address',
      type: 'textarea',
      placeholder: 'Enter first party address',
      required: true,
    },
    {
      id: 'party2Name',
      label: 'Second Party Name',
      type: 'text',
      placeholder: 'Enter second party name',
      required: true,
    },
    {
      id: 'party2Address',
      label: 'Second Party Address',
      type: 'textarea',
      placeholder: 'Enter second party address',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose of Disclosure',
      type: 'textarea',
      placeholder: 'Describe the purpose',
      required: true,
    },
    {
      id: 'duration',
      label: 'Duration (in years)',
      type: 'number',
      placeholder: 'Enter duration in years',
      required: true,
    },
    {
      id: 'effectiveDate',
      label: 'Effective Date',
      type: 'date',
      required: true,
    },
  ],
  generateContent: (data) => {
    const endDate = new Date(data.effectiveDate);
    endDate.setFullYear(endDate.getFullYear() + parseInt(data.duration));

    return `
MUTUAL NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made on ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}

BETWEEN:

${data.party1Name.toUpperCase()}
of ${data.party1Address}
(hereinafter referred to as "FIRST PARTY" which expression shall where the context so admits include its successors-in-title and assigns) of the one part;

AND

${data.party2Name.toUpperCase()}
of ${data.party2Address}
(hereinafter referred to as "SECOND PARTY" which expression shall where the context so admits include its successors-in-title and assigns) of the other part.

(The First Party and Second Party are hereinafter collectively referred to as "the Parties" and individually as "a Party")

WHEREAS:

A. The Parties wish to explore a business relationship relating to: ${data.purpose}

B. In connection with such discussions, each Party may disclose to the other certain confidential and proprietary information.

C. The Parties wish to protect the confidentiality of such information.

NOW IT IS HEREBY AGREED as follows:

1. DEFINITIONS
1.1 "Confidential Information" means all information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether orally, in writing, or by inspection of tangible objects, including without limitation:
    a) Business plans, strategies, and forecasts
    b) Financial information and projections
    c) Technical data and know-how
    d) Customer and supplier information
    e) Trade secrets and proprietary information
    f) Any other information marked as "Confidential"

1.2 Confidential Information shall not include information that:
    a) Is or becomes publicly available through no breach of this Agreement
    b) Was rightfully in the possession of the Receiving Party prior to disclosure
    c) Is independently developed by the Receiving Party without reference to Confidential Information
    d) Is rightfully received from a third party without restriction

2. OBLIGATIONS OF CONFIDENTIALITY
2.1 Each Party agrees to:
    a) Keep all Confidential Information strictly confidential
    b) Not disclose Confidential Information to third parties without prior written consent
    c) Use Confidential Information solely for the Purpose stated above
    d) Protect Confidential Information with the same degree of care as its own confidential information
    e) Limit access to Confidential Information to employees and advisors with a need to know

2.2 Disclosure may be made if required by law, provided that the Receiving Party:
    a) Gives prompt written notice to the Disclosing Party
    b) Cooperates with the Disclosing Party in limiting such disclosure

3. OWNERSHIP
All Confidential Information remains the property of the Disclosing Party. No license or other rights in the Confidential Information is granted hereby.

4. NO OBLIGATION
This Agreement does not:
a) Create any obligation to enter into further agreements
b) Create any partnership, joint venture, or agency relationship
c) Restrict either Party from developing or acquiring similar information

5. RETURN OF INFORMATION
Upon written request or termination of discussions, the Receiving Party shall:
a) Promptly return or destroy all Confidential Information
b) Provide written certification of compliance with this provision

6. TERM AND TERMINATION
6.1 This Agreement shall be effective from ${new Date(data.effectiveDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} and shall continue for a period of ${data.duration} year(s), expiring on ${endDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

6.2 The obligations of confidentiality shall survive termination and continue for a period of ${parseInt(data.duration) + 2} years from the date of disclosure.

7. REMEDIES
7.1 Each Party acknowledges that:
    a) Breach of this Agreement may cause irreparable harm
    b) Monetary damages may be inadequate
    c) The Disclosing Party is entitled to seek injunctive relief

7.2 Remedies are cumulative and not exclusive of any other remedies at law or in equity.

8. NO WARRANTY
Confidential Information is provided "as is" without warranty of any kind, express or implied.

9. GOVERNING LAW AND DISPUTE RESOLUTION
9.1 This Agreement shall be governed by the Laws of the Federal Republic of Nigeria.

9.2 Any dispute arising from this Agreement shall be resolved through:
    a) Good faith negotiations
    b) Mediation, if negotiations fail
    c) Arbitration in accordance with the Arbitration and Conciliation Act
    d) The courts of Nigeria shall have exclusive jurisdiction

10. GENERAL PROVISIONS
10.1 This Agreement constitutes the entire agreement between the Parties concerning confidentiality.

10.2 This Agreement may only be amended in writing signed by both Parties.

10.3 No waiver of any provision shall constitute a waiver of any other provision.

10.4 If any provision is held invalid, the remainder shall continue in full force.

10.5 This Agreement may be executed in counterparts.

IN WITNESS WHEREOF the Parties have executed this Agreement the day and year first above written.

SIGNED for and on behalf of
${data.party1Name.toUpperCase()}

_______________________________
Name:
Title:
Date: _______________


SIGNED for and on behalf of
${data.party2Name.toUpperCase()}

_______________________________
Name:
Title:
Date: _______________


WITNESSES:

1. Name: _______________________________
   Address: ____________________________
   Signature: __________________________
   Date: _______________

2. Name: _______________________________
   Address: ____________________________
   Signature: __________________________
   Date: _______________
`.trim();
  },
};
