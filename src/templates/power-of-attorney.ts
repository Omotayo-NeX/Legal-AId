import { DocumentTemplate } from './types';

export const powerOfAttorneyTemplate: DocumentTemplate = {
  id: '6',
  name: 'Power of Attorney',
  description: 'Legal authorization document',
  category: 'other',
  fields: [
    {
      id: 'donorName',
      label: 'Donor Full Name (Principal)',
      type: 'text',
      placeholder: 'Enter donor full name',
      required: true,
    },
    {
      id: 'donorAddress',
      label: 'Donor Address',
      type: 'textarea',
      placeholder: 'Enter donor complete address',
      required: true,
    },
    {
      id: 'donorOccupation',
      label: 'Donor Occupation',
      type: 'text',
      placeholder: 'Enter donor occupation',
      required: true,
    },
    {
      id: 'attorneyName',
      label: 'Attorney Full Name (Agent)',
      type: 'text',
      placeholder: 'Enter attorney full name',
      required: true,
    },
    {
      id: 'attorneyAddress',
      label: 'Attorney Address',
      type: 'textarea',
      placeholder: 'Enter attorney complete address',
      required: true,
    },
    {
      id: 'attorneyOccupation',
      label: 'Attorney Occupation',
      type: 'text',
      placeholder: 'Enter attorney occupation',
      required: true,
    },
    {
      id: 'poaType',
      label: 'Type of Power of Attorney',
      type: 'select',
      options: ['General', 'Special/Limited', 'Durable', 'Financial', 'Property Management'],
      required: true,
    },
    {
      id: 'specificPurpose',
      label: 'Specific Purpose/Powers Granted',
      type: 'textarea',
      placeholder: 'Describe the specific powers being granted',
      required: true,
    },
    {
      id: 'effectiveDate',
      label: 'Effective Date',
      type: 'date',
      required: true,
    },
    {
      id: 'expiryDate',
      label: 'Expiry Date (leave blank for indefinite)',
      type: 'date',
      required: false,
    },
    {
      id: 'revocable',
      label: 'Revocability',
      type: 'select',
      options: ['Revocable', 'Irrevocable'],
      required: true,
    },
  ],
  generateContent: (data) => {
    const hasExpiry = data.expiryDate && data.expiryDate.trim();
    const expiryClause = hasExpiry
      ? `This Power of Attorney shall expire on ${new Date(data.expiryDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.`
      : 'This Power of Attorney shall remain in effect until revoked by the Donor.';

    return `
POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS

THAT I, ${data.donorName.toUpperCase()}, of ${data.donorAddress}, being of sound mind and memory, do hereby make, constitute and appoint ${data.attorneyName.toUpperCase()} of ${data.attorneyAddress}, as my true and lawful Attorney-in-Fact (hereinafter referred to as "the Attorney") to act in my name, place and stead.

This is a ${data.poaType.toUpperCase()} POWER OF ATTORNEY.

1. APPOINTMENT
I hereby grant to my said Attorney full power and authority to undertake and perform the following acts and things:

${data.specificPurpose}

2. SCOPE OF AUTHORITY
2.1 The Attorney shall have power to:
    a) Execute all necessary documents
    b) Sign all required papers, agreements, and contracts
    c) Appear before any authority, court, or tribunal
    d) Make representations on my behalf
    e) Take all actions reasonably necessary to accomplish the purposes stated above
    f) Incur reasonable expenses in the performance of duties

${data.poaType === 'General' ? `
2.2 This is a GENERAL Power of Attorney and my Attorney shall have broad authority to act on my behalf in all matters, including but not limited to:
    a) Financial transactions
    b) Property management
    c) Legal proceedings
    d) Business operations
    e) Banking and investments
    f) Tax matters
` : ''}

${data.poaType === 'Financial' ? `
2.2 This is a FINANCIAL Power of Attorney limited to:
    a) Banking transactions
    b) Investment decisions
    c) Tax filings and payments
    d) Bill payments
    e) Financial record keeping
    f) Insurance matters
` : ''}

${data.poaType === 'Property Management' ? `
2.2 This is a PROPERTY MANAGEMENT Power of Attorney limited to:
    a) Managing, leasing, and renting property
    b) Collecting rents and revenues
    c) Paying property taxes and expenses
    d) Maintaining and repairing property
    e) Entering into tenancy agreements
    f) Taking legal action regarding property
` : ''}

3. EFFECTIVE DATE AND DURATION
3.1 This Power of Attorney shall become effective on ${new Date(data.effectiveDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

3.2 ${expiryClause}

4. REVOCABILITY
This Power of Attorney is ${data.revocable.toUpperCase()}.

${data.revocable === 'Revocable' ? `
4.1 I reserve the right to revoke, modify, or amend this Power of Attorney at any time by providing written notice to:
    a) The Attorney
    b) Any third party relying on this Power of Attorney

4.2 Revocation shall be effective upon receipt of written notice.
` : `
4.1 This Power of Attorney is IRREVOCABLE and cannot be revoked, modified, or amended except:
    a) By mutual written agreement of both parties
    b) By order of a competent court
    c) Upon death of either party
    d) Upon the expiry date (if specified)
`}

5. THIRD PARTY RELIANCE
5.1 Any third party may rely upon this Power of Attorney and the representations and actions of my Attorney.

5.2 Third parties are not required to inquire into the authority of my Attorney or the propriety of actions taken.

5.3 I hereby indemnify and hold harmless any third party acting in good faith reliance on this Power of Attorney.

6. RATIFICATION
6.1 I hereby ratify and confirm all acts lawfully performed by my Attorney pursuant to this Power of Attorney.

6.2 All actions taken by my Attorney within the scope of authority granted shall have the same effect as if performed by me personally.

7. COMPENSATION
7.1 My Attorney shall be entitled to: [  ] Compensation  [  ] No Compensation

7.2 If compensated, the Attorney shall be entitled to reasonable remuneration for services rendered.

7.3 The Attorney shall be reimbursed for all reasonable expenses incurred.

8. SUCCESSORS
${data.poaType === 'General' || data.poaType === 'Durable' ? `
8.1 This Power of Attorney shall survive my incapacity and continue in full force.

8.2 If my Attorney becomes unable or unwilling to serve, I appoint:
    Name: _______________________________
    Address: ____________________________
    as Successor Attorney.
` : `
8.1 This Power of Attorney shall terminate upon my incapacity unless otherwise specified.
`}

9. LIMITATIONS
9.1 My Attorney shall NOT have authority to:
    a) Make gifts of my property (unless specifically authorized)
    b) Change beneficiaries of my insurance or retirement accounts
    c) Make, amend, or revoke my will
    d) Engage in self-dealing or conflicts of interest
    e) Delegate this authority to another person

10. ATTORNEY'S OBLIGATIONS
10.1 My Attorney shall:
    a) Act in good faith and in my best interests
    b) Exercise reasonable care and diligence
    c) Keep accurate records of all transactions
    d) Avoid conflicts of interest
    e) Keep my property separate from personal property
    f) Provide accountings upon request

11. GOVERNING LAW
This Power of Attorney shall be governed by and construed in accordance with the Laws of the Federal Republic of Nigeria.

12. SEVERABILITY
If any provision of this Power of Attorney is held invalid, the remaining provisions shall continue in full force and effect.

IN WITNESS WHEREOF, I have hereunto set my hand this ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

SIGNED, SEALED AND DELIVERED
by the within named DONOR

_______________________________
${data.donorName}
(Donor/Principal's Signature)

Date: _______________


ACCEPTANCE BY ATTORNEY

I, ${data.attorneyName}, hereby accept the appointment as Attorney-in-Fact and agree to faithfully discharge the duties and responsibilities set forth in this Power of Attorney.

_______________________________
${data.attorneyName}
(Attorney's Signature)

Date: _______________


WITNESSES:

1. Name: _______________________________
   Address: ____________________________
   Occupation: _________________________
   Signature: __________________________
   Date: _______________

2. Name: _______________________________
   Address: ____________________________
   Occupation: _________________________
   Signature: __________________________
   Date: _______________


ACKNOWLEDGMENT/NOTARIZATION

State/Region: ____________________________
Local Government: ________________________

On this _____ day of _____________, 20___, before me personally appeared ${data.donorName}, known to me to be the person described in and who executed the foregoing instrument, and acknowledged that he/she executed the same as his/her free act and deed.

SWORN to before me this _____ day of _____________, 20___


_______________________________
COMMISSIONER FOR OATHS/
NOTARY PUBLIC

Name: __________________________
Stamp: _________________________


IMPORTANT NOTES:
1. This Power of Attorney must be executed before a Commissioner for Oaths or Notary Public.
2. The Donor must be of sound mind and not under duress.
3. Valid identification must be presented by both Donor and Attorney.
4. It is advisable to register this Power of Attorney at the appropriate registry.
5. Certified copies should be provided to relevant institutions.
6. The Donor should retain the original document.
`.trim();
  },
};
