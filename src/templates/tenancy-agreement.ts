import { DocumentTemplate } from './types';

export const tenancyAgreementTemplate: DocumentTemplate = {
  id: '1',
  name: 'Tenancy Agreement',
  description: 'Standard residential tenancy agreement',
  category: 'tenancy',
  fields: [
    {
      id: 'landlordName',
      label: 'Landlord Full Name',
      type: 'text',
      placeholder: 'Enter landlord full name',
      required: true,
    },
    {
      id: 'landlordAddress',
      label: 'Landlord Address',
      type: 'textarea',
      placeholder: 'Enter landlord complete address',
      required: true,
    },
    {
      id: 'tenantName',
      label: 'Tenant Full Name',
      type: 'text',
      placeholder: 'Enter tenant full name',
      required: true,
    },
    {
      id: 'tenantAddress',
      label: 'Tenant Address',
      type: 'textarea',
      placeholder: 'Enter tenant complete address',
      required: true,
    },
    {
      id: 'propertyAddress',
      label: 'Property Address',
      type: 'textarea',
      placeholder: 'Enter property address to be rented',
      required: true,
    },
    {
      id: 'rentAmount',
      label: 'Monthly Rent Amount (₦)',
      type: 'number',
      placeholder: 'Enter monthly rent',
      required: true,
    },
    {
      id: 'securityDeposit',
      label: 'Security Deposit (₦)',
      type: 'number',
      placeholder: 'Enter security deposit amount',
      required: true,
    },
    {
      id: 'leaseTerm',
      label: 'Lease Term (in months)',
      type: 'number',
      placeholder: 'Enter lease duration in months',
      required: true,
    },
    {
      id: 'commencementDate',
      label: 'Commencement Date',
      type: 'date',
      required: true,
    },
    {
      id: 'paymentDay',
      label: 'Rent Payment Day',
      type: 'number',
      placeholder: 'Day of month (1-31)',
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

    const endDate = new Date(data.commencementDate);
    endDate.setMonth(endDate.getMonth() + parseInt(data.leaseTerm));

    return `
RESIDENTIAL TENANCY AGREEMENT

THIS TENANCY AGREEMENT is made on ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}

BETWEEN:

${data.landlordName.toUpperCase()}
of ${data.landlordAddress}
(hereinafter referred to as "the LANDLORD" which expression shall where the context so admits include his/her heirs, executors, administrators, successors-in-title and assigns) of the one part;

AND

${data.tenantName.toUpperCase()}
of ${data.tenantAddress}
(hereinafter referred to as "the TENANT" which expression shall where the context so admits include his/her heirs, executors, administrators and permitted assigns) of the other part.

WITNESSETH AS FOLLOWS:

1. PROPERTY DESCRIPTION
The Landlord hereby agrees to let and the Tenant hereby agrees to take the premises known and described as:
${data.propertyAddress}
(hereinafter referred to as "the Premises")

2. TERM
The tenancy shall be for a period of ${data.leaseTerm} months commencing from ${new Date(data.commencementDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} and expiring on ${endDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

3. RENT
The Tenant agrees to pay to the Landlord the sum of ${formatCurrency(parseFloat(data.rentAmount))} monthly as rent for the Premises. Payment shall be made on or before the ${data.paymentDay}${data.paymentDay == 1 ? 'st' : data.paymentDay == 2 ? 'nd' : data.paymentDay == 3 ? 'rd' : 'th'} day of each month.

4. SECURITY DEPOSIT
The Tenant has paid the sum of ${formatCurrency(parseFloat(data.securityDeposit))} as security deposit which shall be refundable at the expiration or determination of this tenancy, subject to deductions for any damages to the Premises or breach of this Agreement.

5. TENANT'S OBLIGATIONS
The Tenant hereby covenants with the Landlord:
a) To pay the rent promptly and without demand on the due date
b) To use the Premises solely for residential purposes
c) To keep the Premises in good and tenantable repair
d) To pay all utility bills including electricity, water, and waste disposal
e) Not to sub-let or assign the Premises without the Landlord's written consent
f) Not to make any structural alterations to the Premises
g) To allow the Landlord reasonable access for inspection and repairs
h) To maintain peace and good order in the Premises
i) To comply with all applicable laws and regulations

6. LANDLORD'S OBLIGATIONS
The Landlord hereby covenants with the Tenant:
a) To ensure quiet enjoyment of the Premises
b) To maintain the structure and exterior of the Premises
c) To carry out major repairs not caused by the Tenant's negligence
d) To ensure the Premises is fit for habitation at commencement

7. UTILITIES
The Tenant shall be responsible for payment of all utilities including but not limited to electricity, water, sewage, and waste disposal charges.

8. TERMINATION
This Agreement may be terminated:
a) By mutual agreement in writing
b) By the Tenant giving 30 days written notice
c) By the Landlord for breach of any term herein
d) Upon expiration of the lease term

9. BREACH AND REMEDIES
In the event of breach by the Tenant, the Landlord reserves the right to:
a) Forfeit the security deposit
b) Terminate the tenancy
c) Take legal action for recovery of rent and damages

10. NOTICES
Any notice required under this Agreement shall be in writing and delivered personally or sent by registered post to the addresses stated above.

11. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the Laws of the Federal Republic of Nigeria.

IN WITNESS WHEREOF the parties have hereunto set their hands the day and year first above written.

SIGNED by the within named LANDLORD

_______________________________
${data.landlordName}
(Landlord's Signature)

Date: _______________


SIGNED by the within named TENANT

_______________________________
${data.tenantName}
(Tenant's Signature)

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
