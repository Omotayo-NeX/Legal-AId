import { DocumentTemplate } from './types';

export const employmentContractTemplate: DocumentTemplate = {
  id: '3',
  name: 'Employment Contract',
  description: 'Standard employment agreement template',
  category: 'employment',
  fields: [
    {
      id: 'companyName',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter company name',
      required: true,
    },
    {
      id: 'companyAddress',
      label: 'Company Address',
      type: 'textarea',
      placeholder: 'Enter company address',
      required: true,
    },
    {
      id: 'employeeName',
      label: 'Employee Full Name',
      type: 'text',
      placeholder: 'Enter employee full name',
      required: true,
    },
    {
      id: 'employeeAddress',
      label: 'Employee Address',
      type: 'textarea',
      placeholder: 'Enter employee address',
      required: true,
    },
    {
      id: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      placeholder: 'Enter job title',
      required: true,
    },
    {
      id: 'department',
      label: 'Department',
      type: 'text',
      placeholder: 'Enter department',
      required: true,
    },
    {
      id: 'salary',
      label: 'Annual Salary (₦)',
      type: 'number',
      placeholder: 'Enter annual salary',
      required: true,
    },
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
    {
      id: 'workingHours',
      label: 'Working Hours per Week',
      type: 'number',
      placeholder: 'Enter hours (e.g., 40)',
      required: true,
    },
    {
      id: 'probationPeriod',
      label: 'Probation Period (months)',
      type: 'number',
      placeholder: 'Enter probation period',
      required: true,
    },
    {
      id: 'annualLeave',
      label: 'Annual Leave Days',
      type: 'number',
      placeholder: 'Enter leave days',
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

    const monthlySalary = parseFloat(data.salary) / 12;
    const probationEndDate = new Date(data.startDate);
    probationEndDate.setMonth(probationEndDate.getMonth() + parseInt(data.probationPeriod));

    return `
EMPLOYMENT CONTRACT

THIS AGREEMENT is made on ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}

BETWEEN:

${data.companyName.toUpperCase()}
(RC No: __________________)
of ${data.companyAddress}
(hereinafter referred to as "the EMPLOYER" which expression shall where the context so admits include its successors-in-title and assigns) of the one part;

AND

${data.employeeName.toUpperCase()}
of ${data.employeeAddress}
(hereinafter referred to as "the EMPLOYEE") of the other part.

WHEREAS the Employer desires to employ the Employee and the Employee has agreed to accept such employment upon the terms and conditions hereinafter contained.

NOW IT IS HEREBY AGREED as follows:

1. APPOINTMENT
1.1 The Employer hereby employs the Employee and the Employee accepts employment as ${data.jobTitle} in the ${data.department} department.

1.2 The Employee shall perform such duties as may be assigned by the Employer from time to time.

2. COMMENCEMENT
2.1 This employment shall commence on ${new Date(data.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

2.2 The Employee shall be on probation for a period of ${data.probationPeriod} month(s) ending on ${probationEndDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.

2.3 During probation, either party may terminate employment with one week's notice.

3. REMUNERATION
3.1 The Employee shall be paid an annual salary of ${formatCurrency(parseFloat(data.salary))} (${formatCurrency(monthlySalary)} monthly) payable in arrears by bank transfer.

3.2 Salary shall be reviewed annually at the Employer's discretion.

3.3 The Employer shall make all statutory deductions including:
    a) Pay As You Earn (PAYE) tax
    b) Pension contributions
    c) National Health Insurance Scheme (NHIS)
    d) Any other statutory deductions

4. WORKING HOURS
4.1 Normal working hours are ${data.workingHours} hours per week, Monday to Friday.

4.2 The Employee may be required to work additional hours as reasonably necessary without additional compensation.

4.3 Attendance and punctuality are essential conditions of employment.

5. LEAVE ENTITLEMENT
5.1 The Employee is entitled to ${data.annualLeave} working days of paid annual leave per year.

5.2 Leave must be approved in advance by the Employee's supervisor.

5.3 The Employee is entitled to sick leave in accordance with company policy and Nigerian Labour Laws.

5.4 The Employee is entitled to all public holidays recognized in Nigeria.

6. DUTIES AND RESPONSIBILITIES
6.1 The Employee shall:
    a) Diligently perform assigned duties
    b) Comply with all company policies and procedures
    c) Maintain confidentiality of company information
    d) Act in the best interests of the Employer
    e) Not engage in any activity that conflicts with the Employer's interests
    f) Report to work punctually and maintain professional conduct

6.2 The Employee shall devote full working time and attention to the Employer's business.

7. CONFIDENTIALITY
7.1 The Employee shall not during or after employment disclose confidential information including:
    a) Trade secrets
    b) Business strategies
    c) Client information
    d) Financial information
    e) Proprietary processes and methods

7.2 This obligation continues indefinitely after termination.

8. INTELLECTUAL PROPERTY
8.1 All work products, inventions, and intellectual property created during employment belong to the Employer.

8.2 The Employee shall execute all documents necessary to vest such rights in the Employer.

9. TERMINATION
9.1 After probation, either party may terminate this contract by giving:
    a) One month's written notice, or
    b) Payment in lieu of notice

9.2 The Employer may terminate employment without notice for:
    a) Gross misconduct
    b) Fraud or dishonesty
    c) Breach of confidentiality
    d) Conviction of a criminal offense
    e) Serious or persistent breach of contract

9.3 Upon termination, the Employee shall:
    a) Return all company property
    b) Delete all company information from personal devices
    c) Complete handover procedures

10. BENEFITS
10.1 The Employee shall be entitled to benefits in accordance with company policy including:
    a) Pension contributions as required by the Pension Reform Act
    b) Health insurance
    c) Other benefits as determined by the Employer

11. POST-EMPLOYMENT RESTRICTIONS
11.1 For a period of 6 months after termination, the Employee shall not:
    a) Solicit or conduct business with the Employer's clients
    b) Employ or solicit the Employer's employees
    c) Engage in competitive business within Nigeria

12. GRIEVANCE PROCEDURE
12.1 The Employee may raise grievances through the company's grievance procedure.

12.2 The Employer shall address grievances in accordance with company policy and Nigerian Labour Laws.

13. GENERAL PROVISIONS
13.1 This Agreement constitutes the entire agreement between the parties.

13.2 This Agreement may only be amended in writing signed by both parties.

13.3 This Agreement shall be governed by the Laws of the Federal Republic of Nigeria.

13.4 The Employee confirms that there are no restrictions preventing this employment.

14. ACCEPTANCE
The Employee acknowledges having read, understood, and agreed to be bound by this Agreement and all company policies.

IN WITNESS WHEREOF the parties have executed this Agreement the day and year first above written.

SIGNED for and on behalf of
${data.companyName.toUpperCase()}

_______________________________
Name:
Title:
Date: _______________

Company Seal (if applicable)


SIGNED by the EMPLOYEE
${data.employeeName.toUpperCase()}

_______________________________
Signature
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
