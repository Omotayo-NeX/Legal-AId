import { DocumentTemplate } from './types';

export const loanAgreementTemplate: DocumentTemplate = {
  id: '4',
  name: 'Loan Agreement',
  description: 'Personal or business loan contract',
  category: 'business',
  fields: [
    {
      id: 'lenderName',
      label: 'Lender Full Name',
      type: 'text',
      placeholder: 'Enter lender full name',
      required: true,
    },
    {
      id: 'lenderAddress',
      label: 'Lender Address',
      type: 'textarea',
      placeholder: 'Enter lender address',
      required: true,
    },
    {
      id: 'borrowerName',
      label: 'Borrower Full Name',
      type: 'text',
      placeholder: 'Enter borrower full name',
      required: true,
    },
    {
      id: 'borrowerAddress',
      label: 'Borrower Address',
      type: 'textarea',
      placeholder: 'Enter borrower address',
      required: true,
    },
    {
      id: 'loanAmount',
      label: 'Loan Amount (₦)',
      type: 'number',
      placeholder: 'Enter loan amount',
      required: true,
    },
    {
      id: 'interestRate',
      label: 'Interest Rate (% per annum)',
      type: 'number',
      placeholder: 'Enter interest rate',
      required: true,
    },
    {
      id: 'loanPurpose',
      label: 'Purpose of Loan',
      type: 'textarea',
      placeholder: 'Describe the purpose',
      required: true,
    },
    {
      id: 'repaymentPeriod',
      label: 'Repayment Period (months)',
      type: 'number',
      placeholder: 'Enter repayment period',
      required: true,
    },
    {
      id: 'disbursementDate',
      label: 'Disbursement Date',
      type: 'date',
      required: true,
    },
    {
      id: 'repaymentFrequency',
      label: 'Repayment Frequency',
      type: 'select',
      options: ['Monthly', 'Quarterly', 'Lump Sum'],
      required: true,
    },
  ],
  generateContent: (data) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(amount);
    };

    const principal = parseFloat(data.loanAmount);
    const rate = parseFloat(data.interestRate) / 100;
    const months = parseInt(data.repaymentPeriod);
    const interest = principal * rate * (months / 12);
    const totalAmount = principal + interest;

    const repaymentEndDate = new Date(data.disbursementDate);
    repaymentEndDate.setMonth(repaymentEndDate.getMonth() + months);

    let installmentAmount = 0;
    if (data.repaymentFrequency === 'Monthly') {
      installmentAmount = totalAmount / months;
    } else if (data.repaymentFrequency === 'Quarterly') {
      installmentAmount = totalAmount / (months / 3);
    } else {
      installmentAmount = totalAmount;
    }

    return `
LOAN AGREEMENT

THIS AGREEMENT is made on ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}

BETWEEN:

${data.lenderName.toUpperCase()}
of ${data.lenderAddress}
(hereinafter referred to as "the LENDER" which expression shall where the context so admits include his/her heirs, executors, administrators, successors-in-title and assigns) of the one part;

AND

${data.borrowerName.toUpperCase()}
of ${data.borrowerAddress}
(hereinafter referred to as "the BORROWER" which expression shall where the context so admits include his/her heirs, executors, administrators and assigns) of the other part.

WITNESSETH AS FOLLOWS:

1. LOAN GRANT
1.1 The Lender agrees to lend and the Borrower agrees to borrow the sum of ${formatCurrency(principal)} (the "Principal Sum").

1.2 The purpose of this loan is: ${data.loanPurpose}

2. DISBURSEMENT
2.1 The loan shall be disbursed on ${new Date(data.disbursementDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

2.2 The loan shall be paid by: [  ] Cash  [  ] Bank Transfer  [  ] Cheque

2.3 The Borrower acknowledges receipt of the Principal Sum upon execution of this Agreement.

3. INTEREST
3.1 Interest shall accrue on the Principal Sum at the rate of ${data.interestRate}% per annum.

3.2 Total interest for the loan period: ${formatCurrency(interest)}

3.3 Total amount payable (Principal + Interest): ${formatCurrency(totalAmount)}

4. REPAYMENT TERMS
4.1 The Borrower shall repay the loan over a period of ${months} month(s) commencing from ${new Date(data.disbursementDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} and ending on ${repaymentEndDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

4.2 Repayment shall be made ${data.repaymentFrequency.toLowerCase()}.

4.3 ${data.repaymentFrequency !== 'Lump Sum' ? `Installment amount: ${formatCurrency(installmentAmount)}` : `The entire sum of ${formatCurrency(totalAmount)} shall be paid on the repayment date.`}

4.4 Payments shall be made to the Lender's designated bank account or as otherwise directed in writing.

5. EARLY REPAYMENT
5.1 The Borrower may repay the entire outstanding amount early without penalty.

5.2 In case of early repayment, interest shall be calculated pro-rata for the actual period.

6. DEFAULT
6.1 The Borrower shall be in default if:
    a) Any payment is not made within 7 days of the due date
    b) The Borrower becomes bankrupt or insolvent
    c) Any representation made proves to be false
    d) The Borrower breaches any term of this Agreement

6.2 Upon default, the Lender may:
    a) Declare the entire outstanding amount immediately due
    b) Charge a penalty of 5% on overdue amounts
    c) Take legal action for recovery
    d) Enforce any security provided

7. SECURITY
7.1 This loan is: [  ] Secured  [  ] Unsecured

7.2 If secured, the following assets are pledged as security:
    _________________________________________________________________
    _________________________________________________________________

7.3 The Borrower warrants having good title to the security and that it is free from encumbrances.

8. REPRESENTATIONS AND WARRANTIES
8.1 The Borrower represents and warrants that:
    a) This Agreement is legal, valid, and binding
    b) There is no pending litigation against the Borrower
    c) All information provided is true and accurate
    d) The Borrower has capacity to enter this Agreement

9. COSTS
9.1 The Borrower shall bear all costs of:
    a) Preparation and execution of this Agreement
    b) Recovery of overdue amounts
    c) Legal proceedings arising from this Agreement

10. SET-OFF
10.1 The Lender may set-off any amount owed by the Lender to the Borrower against amounts due under this Agreement.

11. NOTICES
11.1 All notices shall be in writing and delivered to the addresses stated above.

11.2 Notices shall be deemed received:
    a) If delivered personally: upon delivery
    b) If sent by registered post: 3 days after posting
    c) If sent by email: upon transmission

12. GOVERNING LAW
12.1 This Agreement shall be governed by the Laws of the Federal Republic of Nigeria.

12.2 The parties irrevocably submit to the jurisdiction of Nigerian courts.

13. DISPUTE RESOLUTION
13.1 Any dispute shall first be resolved through good faith negotiations.

13.2 If negotiations fail within 30 days, the dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act.

14. GENERAL PROVISIONS
14.1 This Agreement constitutes the entire agreement between the parties.

14.2 No amendment shall be valid unless in writing and signed by both parties.

14.3 Failure to exercise any right shall not constitute a waiver.

14.4 If any provision is invalid, the remainder shall continue in full force.

14.5 This Agreement is binding on heirs, successors, and assigns.

IN WITNESS WHEREOF the parties have hereunto set their hands the day and year first above written.

SIGNED by the LENDER

_______________________________
${data.lenderName}
(Lender's Signature)

Date: _______________


SIGNED by the BORROWER

_______________________________
${data.borrowerName}
(Borrower's Signature)

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


ACKNOWLEDGMENT OF RECEIPT

I, ${data.borrowerName}, hereby acknowledge receipt of the sum of ${formatCurrency(principal)} from ${data.lenderName} on this day _____________.

_______________________________
Borrower's Signature
`.trim();
  },
};
