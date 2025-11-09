export interface RightItem {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface RightsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rights: RightItem[];
}

export const rightsCategories: RightsCategory[] = [
  {
    id: 'employment',
    name: 'Employment Rights',
    description: 'Know your rights at work',
    icon: 'briefcase',
    color: '#0077B6',
    rights: [
      {
        id: 'emp-1',
        title: 'Minimum Wage',
        description: 'Your right to fair compensation',
        content: `In Nigeria, the National Minimum Wage Act (as amended in 2024) guarantees workers a minimum wage of ₦70,000 per month.

Key Points:
• Applies to all workers in both public and private sectors
• Employers must pay at least this amount for a month's work
• Non-payment is a violation of the law
• Penalties exist for employers who fail to comply

What You Can Do:
If your employer is not paying the minimum wage, you can:
1. Report to the Ministry of Labour
2. Contact the National Labour Congress
3. Seek legal assistance
4. File a complaint with the Industrial Court`,
      },
      {
        id: 'emp-2',
        title: 'Leave Entitlements',
        description: 'Annual leave, sick leave, and maternity leave',
        content: `Nigerian workers are entitled to various types of leave:

Annual Leave:
• At least 6 working days after 12 months of continuous service
• 12 days for workers under 16 years old
• Must be paid during leave period

Sick Leave:
• Reasonable time off for genuine illness
• Medical certificate may be required
• Should be paid for reasonable periods

Maternity Leave:
• 12 weeks of maternity leave (4 weeks before, 8 weeks after delivery)
• Full pay during maternity leave
• Protection from dismissal due to pregnancy
• Right to return to the same position

Paternity Leave:
• Some organizations offer paternity leave
• Not universally mandated by federal law
• Check your employment contract`,
      },
      {
        id: 'emp-3',
        title: 'Wrongful Termination',
        description: 'Protection against unfair dismissal',
        content: `You are protected against wrongful termination in Nigeria.

Grounds for Protection:
• Pregnancy or maternity
• Trade union membership or activities
• Filing a workplace complaint
• Discrimination based on ethnicity, religion, or gender
• Without proper notice or compensation

Notice Requirements:
• 1 day's notice for daily workers
• 1 week's notice for weekly workers
• 2 weeks' notice for monthly paid staff
• 1 month's notice for senior staff
• Or payment in lieu of notice

What Constitutes Wrongful Termination:
• Dismissal without following due process
• Termination based on discrimination
• Retaliation for lawful actions
• Breach of employment contract terms

Your Rights:
• Compensation for wrongful dismissal
• Possible reinstatement
• Payment of outstanding salary and benefits
• Legal recourse through the Industrial Court`,
      },
      {
        id: 'emp-4',
        title: 'Workplace Safety',
        description: 'Right to a safe working environment',
        content: `Every employee has the right to work in a safe and healthy environment.

Key Rights:
• Safe and hazard-free workplace
• Proper safety equipment and training
• Protection from workplace hazards
• Right to refuse unsafe work
• Workers' compensation for injuries

Employer Obligations:
• Provide necessary safety equipment
• Conduct regular safety training
• Maintain equipment and facilities
• Report workplace accidents
• Provide first aid facilities

What To Do If Unsafe:
1. Report hazards to your supervisor
2. Contact the Factory Inspectorate Division
3. Report to Ministry of Labour
4. Document unsafe conditions
5. Seek legal advice if needed

Workers' Compensation:
• Medical treatment for work injuries
• Compensation for temporary/permanent disability
• Death benefits for dependents
• Rehabilitation services`,
      },
    ],
  },
  {
    id: 'tenant',
    name: 'Tenant Rights',
    description: 'Your rights as a tenant',
    icon: 'home',
    color: '#06D6A0',
    rights: [
      {
        id: 'ten-1',
        title: 'Security Deposits',
        description: 'Rules about rent deposits and refunds',
        content: `Understanding your rights regarding security deposits:

What Landlords Can Charge:
• Typically 1-2 years rent in advance (common in Nigeria)
• Security deposit/caution fee
• Legal/agency fees
• Service charges (if applicable)

Your Rights:
• Receive a receipt for all payments
• Get a proper tenancy agreement
• Refund of security deposit at end of tenancy
• Deductions must be for actual damages only
• Right to dispute unfair deductions

Deposit Refund:
The landlord must return your deposit minus:
• Cost of repairs for tenant-caused damage
• Unpaid rent or utilities
• Breach of tenancy agreement costs

They CANNOT deduct for:
• Normal wear and tear
• Pre-existing damage
• Improvements you made
• General maintenance

Best Practices:
• Document property condition at move-in
• Take photos/videos of the property
• Keep all payment receipts
• Report repairs promptly in writing
• Do a walkthrough before moving out`,
      },
      {
        id: 'ten-2',
        title: 'Eviction Rights',
        description: 'Protection against illegal eviction',
        content: `You have strong protections against illegal eviction:

Legal Eviction Requirements:
• Landlord must give proper notice (usually 6 months)
• Valid reason for eviction required
• Must obtain a court order (Recovery of Premises Order)
• Cannot forcefully evict without court approval

Illegal Eviction Includes:
• Changing locks without court order
• Removing your belongings
• Cutting off utilities to force you out
• Threatening or harassing you
• Evicting without proper notice

Valid Reasons for Eviction:
• Non-payment of rent
• Breach of tenancy agreement
• Property needed for landlord's use
• Major renovations required
• End of lease term (with notice)

Your Rights During Eviction:
• Right to be heard in court
• Time to find alternative accommodation
• Protection of your belongings
• Compensation in some cases

What To Do If Illegally Evicted:
1. Do not leave voluntarily if threatened
2. Report to the police immediately
3. Contact a lawyer
4. Apply for an injunction
5. Sue for damages and compensation
6. Report to relevant housing authorities`,
      },
      {
        id: 'ten-3',
        title: 'Repairs & Maintenance',
        description: 'Landlord obligations for property upkeep',
        content: `Landlords have legal obligations to maintain the property:

Landlord's Responsibilities:
• Structural repairs (roof, walls, foundation)
• Plumbing and water supply
• Electrical systems
• Common areas in buildings
• Major appliances (if provided)
• Ensuring habitable conditions

Tenant's Responsibilities:
• Minor repairs from normal use
• Keeping property clean
• Reporting damages promptly
• Not causing intentional damage
• Maintaining provided appliances

How to Request Repairs:
1. Report the issue in writing (email/letter)
2. Give reasonable time for repairs
3. Follow up if not addressed
4. Document the issue with photos
5. Keep copies of all communication

If Landlord Refuses Repairs:
• Send formal written notice
• Give reasonable deadline
• Report to environmental health officer
• Consider rent withholding (get legal advice first)
• Apply to court for orders
• Claim compensation for damages

Emergency Repairs:
For urgent issues (burst pipes, no water, electrical hazards):
• Report immediately
• Landlord must act promptly
• You may fix and deduct from rent (with evidence)
• Keep all receipts and documentation`,
      },
      {
        id: 'ten-4',
        title: 'Privacy Rights',
        description: 'Landlord access and your privacy',
        content: `As a tenant, you have the right to privacy and quiet enjoyment:

Your Privacy Rights:
• Right to quiet enjoyment of the property
• Landlord cannot enter without permission
• Must give reasonable notice (usually 24-48 hours)
• Entry only at reasonable hours
• Only for legitimate reasons

Legitimate Reasons for Entry:
• Making necessary repairs
• Showing property to prospective tenants/buyers
• Inspecting property condition
• Emergencies only (without notice)

Landlord CANNOT:
• Enter whenever they want
• Harass you with constant visits
• Enter without notice except emergencies
• Bring people to view at unreasonable times
• Install cameras in private areas

What Constitutes Harassment:
• Frequent unannounced visits
• Threats or intimidation
• Cutting off essential services
• Interference with quiet enjoyment
• Refusing necessary repairs

Your Options If Privacy Violated:
1. Document all incidents
2. Send written complaint to landlord
3. Report to police if harassment occurs
4. Apply for restraining order
5. Sue for damages
6. Report to housing authorities
7. Consider lease termination with cause`,
      },
    ],
  },
  {
    id: 'consumer',
    name: 'Consumer Rights',
    description: 'Your rights as a consumer',
    icon: 'cart',
    color: '#F77F00',
    rights: [
      {
        id: 'con-1',
        title: 'Right to Refunds',
        description: 'When you can get your money back',
        content: `The Federal Competition and Consumer Protection Act (FCCPA) 2018 protects your right to refunds:

You Have the Right to Refund For:
• Defective or faulty products
• Products not as described
• Services not properly rendered
• Misleading advertising
• Unsafe products
• Breach of warranty

Timeframes:
• Report defects within a reasonable time
• Many stores offer 7-30 day return policies
• Statutory rights last longer than store policies
• Warranties vary by product type

How to Get a Refund:
1. Contact the seller immediately
2. Explain the problem clearly
3. Provide proof of purchase (receipt)
4. Request refund, repair, or replacement
5. Escalate to manager if needed
6. File complaint with FCCPC if refused

You May Choose:
• Full refund
• Replacement product
• Repair of the product
• Partial refund for reduced value

Exceptions (No Refund Required):
• You changed your mind (unless store policy allows)
• You damaged the product yourself
• You were told about defects before purchase
• You misused the product

Online Purchases:
• May have cooling-off period
• Right to return within specified days
• Seller should cover return shipping for defects
• Full refund including delivery charges`,
      },
      {
        id: 'con-2',
        title: 'Product Quality',
        description: 'Standards for goods and services',
        content: `All products and services sold in Nigeria must meet quality standards:

Quality Requirements:
• Fit for the purpose sold
• As described by the seller
• Of merchantable quality
• Safe for consumer use
• Match any sample shown

Your Rights:
• Products must work properly
• Services must be performed with reasonable skill
• Products must last a reasonable time
• Free from defects not obvious at purchase
• Includes implied warranties

Implied Warranties:
Even without written warranty, sellers guarantee:
• Products are as described
• Suitable for normal use
• Free from hidden defects
• Safe when used properly
• Match advertising claims

Defective Products:
If product is defective, you can claim:
• Repair or replacement
• Partial or full refund
• Compensation for damages caused
• Cost of alternative product

Service Quality:
Services must be:
• Performed with reasonable care and skill
• Completed within reasonable time
• Charged at reasonable price (if not agreed)
• Fit for purpose discussed

File a Complaint:
1. Contact the business first
2. Explain what's wrong
3. State what you want (refund/repair)
4. Give reasonable time to respond
5. Escalate to FCCPC if unresolved
6. Consider small claims court`,
      },
      {
        id: 'con-3',
        title: 'False Advertising',
        description: 'Protection against misleading claims',
        content: `You are protected against false and misleading advertising:

What is False Advertising:
• Untrue claims about products/services
• Exaggerated benefits
• Misleading prices or discounts
• False scarcity ("only 2 left!")
• Fake testimonials or endorsements
• Hidden terms and conditions

Common Examples:
• "Original price" that was never charged
• "While stocks last" when plenty in stock
• Photoshopped product images
• False "limited time offer"
• Unsubstantiated health claims
• Fake "going out of business" sales

Your Rights:
• Product must match advertising
• Receive what was promised
• Get advertised price
• Full disclosure of terms
• Truthful information

Protected Against:
• Bait and switch tactics
• Hidden fees and charges
• Misleading comparisons
• False certifications
• Deceptive packaging
• Pyramid schemes

What To Do:
1. Keep the advertisement (screenshot/photo)
2. Keep receipt and evidence
3. Contact the seller first
4. Report to FCCPC
5. Report to Advertising Regulatory Council of Nigeria (ARCON)
6. Post on social media (factually)
7. Warn others

Remedies Available:
• Refund of purchase price
• Compensation for losses
• Seller may face fines
• Advertisement may be banned
• Business may face sanctions`,
      },
      {
        id: 'con-4',
        title: 'Online Shopping Rights',
        description: 'Protection for e-commerce purchases',
        content: `Special protections exist for online purchases:

Your Online Shopping Rights:
• Accurate product descriptions
• Clear pricing and fees
• Secure payment processing
• Delivery within stated time
• Right to return faulty items
• Privacy of personal data

Before You Buy:
Check for:
• Seller's contact information
• Return and refund policy
• Shipping costs and timeframes
• Payment security (https://)
• Customer reviews
• Terms and conditions

Delivery Rights:
• Receive within stated timeframe
• Products as shown and described
• Proper packaging
• Ability to track shipment
• Safe delivery
• Full order received

If Items Don't Arrive:
1. Contact seller with order details
2. Check tracking information
3. Request refund or re-shipment
4. Dispute with payment provider
5. Report to FCCPC
6. Leave review warning others

Payment Protection:
• Use secure payment methods
• Save transaction confirmations
• Check for encryption (padlock icon)
• Avoid wire transfers to unknown sellers
• Use credit cards when possible (more protection)
• Screenshot the order

Fraudulent Sites:
Warning signs:
• Prices too good to be true
• Poor grammar/spelling
• No contact information
• Pressure to buy immediately
• Requests for unusual payment
• Recently created website

Report Online Fraud:
• Nigeria Police Force cybercrime unit
• EFCC (Economic and Financial Crimes Commission)
• FCCPC
• Your bank/payment provider
• Social media platforms (if advertised there)`,
      },
    ],
  },
  {
    id: 'family',
    name: 'Family & Marriage',
    description: 'Family law and marriage rights',
    icon: 'people',
    color: '#E63946',
    rights: [
      {
        id: 'fam-1',
        title: 'Marriage Rights',
        description: 'Legal rights in marriage',
        content: `Understanding your rights within marriage in Nigeria:

Types of Marriage:
• Statutory Marriage (Marriage Act)
• Customary Marriage (traditional)
• Islamic Marriage (Sharia law in some states)

Rights in Statutory Marriage:
• Equal partnership
• Right to property acquired during marriage
• Right to maintenance and support
• Inheritance rights
• Child custody rights
• Right to divorce

Property Rights:
• Both spouses can own property
• Property acquired during marriage may be joint
• Contribution doesn't have to be financial
• Homemaker contributions recognized
• Cannot sell joint property without consent

Financial Rights:
• Right to reasonable maintenance
• Access to joint accounts (if established)
• Share of joint assets on divorce
• Child support obligations
• Spousal support in some cases

Protection Rights:
• Protection from domestic violence
• Right to personal safety
• Right to leave abusive situation
• Right to restraining orders
• Criminal charges for abuse

Customary Marriage:
• Varies by ethnic group
• May allow polygamy
• Different property rights
• May have different divorce rules
• Should still protect basic rights`,
      },
      {
        id: 'fam-2',
        title: 'Divorce Rights',
        description: 'Understanding divorce process and rights',
        content: `Divorce rights and process in Nigeria:

Grounds for Divorce:
• Adultery
• Unreasonable behavior
• Desertion (for at least 1 year)
• Two years separation (with consent)
• Five years separation (without consent)
• Failure to consummate marriage

Divorce Process:
1. File petition at High Court
2. Serve divorce papers to spouse
3. Spouse files response (if contested)
4. Attend court hearings
5. Settlement negotiations
6. Final divorce decree

What Can Be Claimed:
• Division of matrimonial property
• Child custody and access
• Child maintenance
• Spousal maintenance (in some cases)
• Pension sharing
• Compensation

Child Custody Factors:
• Best interest of the child
• Child's wishes (if old enough)
• Each parent's ability to care
• Stability and continuity
• Child's relationship with each parent
• Any history of abuse

Children's Rights:
• Custody arrangement in their best interest
• Maintain relationship with both parents
• Financial support from both parents
• Stability and proper care
• Education and healthcare

Property Division:
Court considers:
• Length of marriage
• Contributions (financial and non-financial)
• Needs of children
• Future earning capacity
• Standard of living during marriage

Your Rights During Divorce:
• Legal representation
• Fair hearing
• Protect your children
• Fair division of assets
• Financial support if needed
• Safety from abuse`,
      },
      {
        id: 'fam-3',
        title: 'Child Custody',
        description: 'Parental rights and responsibilities',
        content: `Understanding child custody rights in Nigeria:

Types of Custody:
• Legal custody (decision-making rights)
• Physical custody (where child lives)
• Sole custody (one parent)
• Joint custody (shared responsibility)

Factors Considered:
• Best interest of the child (paramount)
• Child's age and sex
• Child's wishes (if mature enough)
• Parents' ability to care
• Continuity of care
• Each parent's character and conduct

Age Guidelines:
• Infants: Usually with mother
• Children under 7-9: Preference for mother
• Older children: Based on best interest
• Teenagers: Their wishes carry more weight

Both Parents Have Right To:
• Spend time with children
• Participate in decisions
• Access school/medical records
• Be informed of important matters
• Maintain parent-child relationship

Custodial Parent Obligations:
• Provide proper care
• Ensure education
• Provide medical care
• Allow access to other parent (unless danger)
• Not alienate child from other parent

Non-Custodial Parent Rights:
• Access/visitation rights
• Notice of major decisions
• Emergency contact
• School and medical information
• Participate in child's life

Child Maintenance:
Both parents must contribute:
• Basic needs (food, shelter, clothing)
• Education expenses
• Healthcare
• Recreation and development
• According to their means

Modifying Custody:
Custody can be changed if:
• Circumstances change significantly
• Child's needs change
• Parent's situation changes
• Child's preference changes (if mature)
• Custodial parent unfit`,
      },
      {
        id: 'fam-4',
        title: 'Domestic Violence',
        description: 'Protection from abuse',
        content: `Protection from domestic violence in Nigeria:

What is Domestic Violence:
• Physical abuse or assault
• Sexual abuse or rape
• Emotional or psychological abuse
• Economic abuse
• Verbal abuse and threats
• Intimidation and harassment
• Stalking

Violence Against Persons Prohibition Act (VAPP):
Protects against:
• Physical violence
• Sexual violence
• Harmful traditional practices
• Female genital mutilation
• Forced marriage
• Abandonment of dependents

Your Rights:
• Right to safety and security
• Right to leave abusive situation
• Right to protection order
• Right to press criminal charges
• Right to emergency shelter
• Right to medical treatment

Immediate Actions:
If in danger:
1. Call police (112 or 767)
2. Go to safe location
3. Seek medical attention
4. Document injuries (photos)
5. Report to authorities
6. Contact domestic violence hotline

Protection Orders:
You can obtain:
• Emergency protection order (immediate)
• Interim protection order
• Final protection order
• Restraining order
• Exclusion order (removing abuser from home)

Where to Get Help:
• Police stations
• Domestic violence response team
• Ministry of Women Affairs
• NGOs (WARIF, Project Alert, etc.)
• Hospital emergency rooms
• Legal aid clinics
• Family courts

Evidence Collection:
• Photograph injuries
• Keep medical records
• Save threatening messages
• Record witness names
• Keep a journal of incidents
• Save relevant documents

Criminal Prosecution:
Abuser can face:
• Assault charges
• Rape charges (even in marriage)
• Attempted murder
• Kidnapping
• Threat to life
• Prison sentences and fines

Support Services:
• Safe houses/shelters
• Counseling services
• Legal assistance
• Medical care
• Economic empowerment programs
• Children's support`,
      },
    ],
  },
  {
    id: 'traffic',
    name: 'Traffic & Police',
    description: 'Your rights on the road',
    icon: 'car',
    color: '#7209B7',
    rights: [
      {
        id: 'tra-1',
        title: 'Police Stops',
        description: 'Your rights during traffic stops',
        content: `Know your rights when stopped by police:

Police CAN:
• Stop you for traffic violations
• Request your driver's license
• Request vehicle documents
• Conduct sobriety tests
• Search with warrant or probable cause
• Arrest for serious violations

Police CANNOT:
• Demand bribes
• Search without legal basis
• Seize your car arbitrarily
• Use excessive force
• Detain you indefinitely
• Refuse to identify themselves

Your Rights:
• Remain calm and courteous
• Ask why you were stopped
• Request officer's name and ID
• Refuse illegal searches
• Record the encounter (politely)
• Refuse to pay bribes
• Request to see warrant

Required Documents:
Always carry:
• Valid driver's license
• Vehicle license/registration
• Insurance certificate
• Road worthiness certificate
• Proof of ownership

If Asked for Bribe:
1. Politely decline
2. Ask for official ticket
3. Request to go to station
4. Note officer's details
5. Report to authorities
6. File complaint

Illegal Checkpoints:
• Police cannot set up checkpoints solely for extortion
• Must have legitimate purpose
• Should not cause unnecessary delays
• Officers must be in uniform
• Must identify themselves

Valid Reasons for Search:
• Reasonable suspicion of crime
• You consent to search
• Valid search warrant
• Visible contraband
• Vehicle matches crime description

Arrest Procedures:
If arrested, you have right to:
• Know reason for arrest
• Remain silent
• Contact family/lawyer
• Be brought before court within 24-48 hours
• Bail (for bailable offenses)
• Not be tortured or abused

Report Misconduct:
• Public Complaints Rapid Response Unit (PCRRU)
• Police Service Commission
• Human Rights Commission
• Your lawyer
• Social media (with evidence)`,
      },
      {
        id: 'tra-2',
        title: 'Vehicle Impoundment',
        description: 'When vehicles can be seized',
        content: `Understanding when and how vehicles can be impounded:

Legal Reasons for Impoundment:
• Driving without valid license
• Expired vehicle documents
• Unroadworthy vehicle
• Serious traffic violations
• Vehicle used in crime
• Court order

Required Process:
• Must provide impoundment notice
• State reason for impoundment
• Provide receipt for vehicle
• Tell you where vehicle is held
• Explain how to reclaim vehicle

Your Rights:
• Written receipt for your vehicle
• Know the reason for impoundment
• Know location of impound yard
• Retrieve personal belongings
• Challenge unlawful impoundment
• Reasonable fees only

Impoundment Fees:
• Should be reasonable and official
• Posted schedule should exist
• Receipt must be provided
• Cannot charge excessive amounts
• Storage fees may accumulate

How to Reclaim Vehicle:
1. Get impoundment paperwork
2. Rectify the violation
3. Pay any lawful fines
4. Pay storage fees (with receipt)
5. Present ownership documents
6. Collect your vehicle

Illegal Impoundment:
Vehicle CANNOT be impounded for:
• Inability to pay bribe
• Minor correctable issues
• Expired documents if you can renew immediately
• Without proper authority
• Without receipt

If Illegally Impounded:
1. Document everything
2. Get witness information
3. Note officer's details
4. Photograph vehicle condition
5. Refuse to pay bribes
6. Report to authorities
7. Seek legal assistance

Preventing Impoundment:
• Keep all documents current
• Carry documents always
• Maintain vehicle roadworthiness
• Follow traffic laws
• Install dashboard camera
• Know your rights

Where to Report:
• Lagos State Traffic Management Authority (LASTMA)
• Federal Road Safety Corps (FRSC)
• Vehicle Inspection Office
• Police complaints unit
• Legal aid services`,
      },
      {
        id: 'tra-3',
        title: 'Traffic Violations',
        description: 'Common violations and penalties',
        content: `Understanding traffic violations and proper procedures:

Common Traffic Offenses:
• Speeding
• Running red light
• Driving without license
• Driving without proper documents
• Drunk driving
• Dangerous driving
• Using phone while driving
• Not wearing seatbelt

Proper Violation Process:
1. Officer stops you
2. Explains the violation
3. Checks your documents
4. Issues official ticket/notice
5. Explains how to pay fine
6. You sign ticket (not admission of guilt)

Fine Payment:
• Should be official ticket
• Pay at designated locations
• Never pay cash to officer
• Get official receipt
• Keep records
• Can contest in court

Your Options:
• Pay the fine
• Contest the ticket in court
• Attend traffic school (if offered)
• Request reduction (with valid reason)
• Hire lawyer for serious offenses

Serious Offenses:
May result in:
• License suspension
• Vehicle impoundment
• Court appearance required
• Higher fines
• Criminal record
• Imprisonment

Drunk Driving:
• Zero tolerance in many states
• Breathalyzer tests
• Blood alcohol tests
• Severe penalties
• License suspension
• Possible jail time

Points System:
Some states use points:
• Points added for violations
• Accumulation leads to suspension
• Points may expire
• Traffic school may reduce points

Contesting a Ticket:
You can challenge if:
• You didn't commit the violation
• Signs were unclear/missing
• Emergency situation
• Officer error
• Improper procedure followed

Court Process:
1. Plead not guilty
2. Request court date
3. Gather evidence
4. Present your case
5. Judge makes decision
6. Accept or appeal ruling`,
      },
      {
        id: 'tra-4',
        title: 'Road Accident Rights',
        description: 'What to do after an accident',
        content: `Your rights and obligations after a road accident:

Immediate Actions:
1. Stop immediately (fleeing is a crime)
2. Check for injuries
3. Call emergency services (if needed)
4. Move to safe location (if minor)
5. Exchange information
6. Document the scene
7. Report to police

Information to Exchange:
• Full names
• Contact numbers
• License numbers
• Insurance details
• Vehicle registration
• Witness contacts

Document Everything:
• Take photos of:
  - All vehicles involved
  - Damage from multiple angles
  - Accident scene
  - Road conditions
  - Traffic signs
  - Injuries (if any)
• Note weather conditions
• Record time and location
• Get witness statements

Police Report:
• Required for insurance claims
• Must be filed within 24 hours
• Get report number
• Obtain copy for your records
• Ensure accuracy
• Correct any errors

Your Rights:
• Medical treatment
• Insurance compensation
• File police report
• Legal representation
• Not be intimidated
• Fair investigation

Do NOT:
• Admit fault at scene
• Sign unknown documents
• Accept cash settlements (usually)
• Leave scene of accident
• Withhold information from police
• Fail to report

Insurance Claims:
1. Notify your insurer immediately
2. Provide all documentation
3. Cooperate with investigation
4. Get repair estimates
5. Keep all receipts
6. Follow up regularly

If Injured:
• Seek medical attention immediately
• Keep all medical records
• Document all expenses
• Take photos of injuries
• Follow treatment plan
• Keep injury diary

If Other Party Uninsured:
• Report to police
• Document everything thoroughly
• Consider legal action
• Check your own coverage
• File compensation claim
• Seek legal advice

Hit and Run:
If other party flees:
• Note vehicle description
• Get license plate if possible
• Look for witnesses
• Call police immediately
• Report to insurance
• File police report

Legal Action:
You may sue for:
• Medical expenses
• Property damage
• Lost wages
• Pain and suffering
• Future medical costs
• Vehicle repair/replacement

Third-Party Insurance:
In Nigeria, minimum coverage includes:
• Third-party bodily injury
• Third-party property damage
• Must be renewed annually
• Carry proof always`,
      },
    ],
  },
  {
    id: 'tax',
    name: 'Tax Rights & Obligations',
    description: 'New 2025 Tax Reforms',
    icon: 'calculator',
    color: '#F77F00',
    rights: [
      {
        id: 'tax-1',
        title: 'New Tax Law Overview (2025 Reforms)',
        description: 'What changed and when it takes effect',
        content: `NEW NIGERIAN TAX LAW (2025 REFORMS)

Effective Date: 1 January 2026
Signed Into Law: June 2025

Main Acts Introduced:
• Nigeria Tax Act 2025 (NTA)
• Nigeria Tax Administration Act 2025 (NTAA)
• Nigeria Revenue Service Act 2025 (NRS Act)

These laws replace and consolidate older tax acts (like PITA, CIT, FIRS Act, etc.), aiming to:
• Simplify the tax system
• Remove overlapping taxes
• Expand enforcement using digital systems
• Create a unified tax administration

Key Changes:
• FIRS becomes Nigeria Revenue Service (NRS)
• All tax filing moves to digital platforms
• Tax residency rules are stricter
• Freelancers and digital workers are fully recognized
• Multiple state/federal taxes will be harmonized
• TIN + NIN + BVN data will be linked for enforcement

Implementation Timeline:
The detailed guidelines will be released before January 2026. All taxpayers should prepare for the transition to the new digital filing system.`,
      },
      {
        id: 'tax-2',
        title: 'Personal Income Tax Changes',
        description: 'What changed for individual taxpayers',
        content: `PERSONAL INCOME TAX UNDER THE NEW LAW

Changes for Individual Taxpayers:

Personal Income Tax (PIT) is Now Unified:
• Old Personal Income Tax Act (PITA) repealed
• Now consolidated under Nigeria Tax Act 2025
• Filing moves to central digital system (NRS)

Tax Residency Redefined:
• Now taxed on worldwide income if tax resident
• Not just based on physical presence
• Stricter rules for Nigerians living abroad
• Foreign income may now be taxable

PAYE (Pay As You Earn):
• Still applies for employees
• Employers continue deducting from salary
• Filing now through NRS digital platform
• Employer compliance will be tracked digitally

Reliefs & Allowances:
• System restructured under NTA
• Pension, NHF, life insurance deductions remain
• Thresholds may change before 2026
• Final guidance coming soon

What Stays the Same:
• VAT on purchases: Still 7.5%
• Tax rates: To be announced before 2026
• Basic structure: Graduated income tax rates

What to Do Before Jan 2026:
1. Ensure you have a valid TIN
2. Link your TIN with NIN and BVN
3. Ensure employer is remitting PAYE correctly
4. Keep all tax payment records
5. Prepare for digital filing`,
      },
      {
        id: 'tax-3',
        title: 'Freelancers & Digital Workers',
        description: 'New tax obligations for remote workers',
        content: `TAX FOR FREELANCERS, REMOTE WORKERS & DIGITAL EARNERS

Major Changes Under 2025 Tax Reforms:

Full Recognition as Taxable Persons:
• Freelancers now fully recognized under NTA
• Remote workers classified as "self-employed taxable persons"
• Digital earners must comply even without company registration

Income from Foreign Clients:
• May now be taxed if you're Nigerian tax resident
• Worldwide income principle applies
• Dollar/foreign currency earnings are taxable
• PayPal, Payoneer, crypto earnings included

Filing Requirements:
• Must file annual returns even without a company
• Tax calculated using graduated rates
• Simplified forms expected under NRS
• Unified payment channels

Digital Enforcement:
• No more "I don't have a company, so no tax"
• NRS will use data-linking for enforcement
• Bank accounts will be monitored
• BVN + NIN + TIN linkage mandatory

What to Do Now:
1. Get a Tax Identification Number (TIN)
2. Register as self-employed with NRS
3. Keep records of all income (local & foreign)
4. Track business expenses for deductions
5. Prepare to file annually starting 2026
6. Consider consulting a tax professional

Penalties for Non-Compliance:
• Interest on unpaid taxes
• Fines and penalties
• Account restrictions
• Possible prosecution

The "ignorance" defense won't work anymore. Digital systems will track financial flows.`,
      },
      {
        id: 'tax-4',
        title: 'Company Income Tax (CIT)',
        description: 'Changes for businesses and startups',
        content: `COMPANY INCOME TAX UNDER 2025 REFORMS

Changes for Businesses & Companies:

CIT Still Applies - Current Rates:
Until updated in 2026, rates remain:
• 0% for micro companies (₦25m revenue or less)
• 20% for small companies (₦25m - ₦100m)
• 30% for large companies (Above ₦100m)

Administration Changes:
• Filing moves to unified NRS platform
• Single digital filing system
• No more multiple agency confusion

Tax Agency Merger:
• FIRS → Nigeria Revenue Service (NRS)
• Stops overlapping taxes
• Ends state-vs-federal tax confusion
• Single point of contact

Digital Compliance Mandatory:
• E-filing required for most entities
• E-payment platforms
• Real-time tax assessment
• Automated compliance tracking

Harmonized Filing:
• WHT, VAT, CIT, PAYE unified
• Single enforcement timetable
• Consolidated tax certificate
• Streamlined deadlines

Other Taxes (Still in Force):
• VAT: 7.5% (unchanged)
• Education Tax: 2.5% (companies only)
• Capital Gains Tax: 10% (now under NTA)
• Stamp Duty: Being merged into NTA

What Businesses Should Do:
1. Verify your company tax category
2. Update CAC information
3. Ensure BVN of directors is linked
4. Prepare for 100% digital filing
5. Review your tax compliance status
6. Get tax clearance certificate updated

Expected in 2026:
• Unified tax certificate
• CAC + Tax + Compliance in one system
• Automatic tax profiling
• Data matching across agencies`,
      },
      {
        id: 'tax-5',
        title: 'Tax Compliance & Enforcement',
        description: 'What to expect with digital enforcement',
        content: `TAX COMPLIANCE & ENFORCEMENT IN 2026

Digital Enforcement Coming:

Data Matching System:
• TIN + NIN + BVN will be linked
• Bank accounts monitored for income
• Cross-agency data sharing
• Automatic compliance checks

Who Will Be Affected:
User Type → What Changes
• Employees: Employer PAYE remittance tracked
• Freelancers: Automatic tax profiling via financial data
• Businesses: Unified tax certificate required
• Remote Workers: Foreign income now visible and taxable
• Startups: CAC + Tax + Compliance linked

Filing Changes:
• 100% digital filing via NRS platform
• E-payment mandatory
• Real-time processing
• Instant tax receipts
• Consolidated annual statements

Stricter Residency Rules:
• Nigerians abroad may still be taxed
• Worldwide income principle
• Physical presence + other factors
• Tax treaties will be enforced

What You Must Do:
1. Get/Update Your TIN
Visit FIRS/NRS office or apply online

2. Link TIN to NIN and BVN
Essential for compliance verification

3. Register on NRS Platform
Coming before Jan 2026

4. Keep Financial Records
All income and expense documentation

5. File Returns Annually
Even if no tax is due

Penalties for Non-Compliance:
• Late filing: ₦25,000 first month, ₦5,000 per month after
• False information: Up to ₦10 million or 5 years imprisonment
• Tax evasion: Criminal prosecution
• Interest on unpaid tax: Variable rates
• Asset seizure for serious cases

Tax Relief/Deductions Still Available:
• Pension contributions
• NHF (National Housing Fund)
• Life insurance premiums
• NHIS (health insurance)
• Charitable donations (approved organizations)

Rights of Taxpayers:
• Right to be informed
• Right to privacy
• Right to appeal assessments
• Right to representation
• Right to fair treatment
• Right to tax clearance certificate

Where to Get Help:
• Nigeria Revenue Service (NRS) offices
• Certified tax consultants
• Tax clinics (free for low-income)
• Legal Aid Council
• This app's AI assistant`,
      },
      {
        id: 'tax-6',
        title: 'Tax Planning Tips',
        description: 'Legal ways to reduce your tax burden',
        content: `LEGAL TAX PLANNING STRATEGIES

How to Minimize Tax Legally:

For Individuals:
1. Maximize Pension Contributions
• Contribute more to your RSA (Retirement Savings Account)
• Pension contributions are tax-deductible
• Up to certain limits

2. Claim All Allowable Reliefs
• Consolidated Relief Allowance (CRA)
• 1% of gross income or ₦200,000 (higher)
• Plus 20% of gross income
• National Housing Fund (NHF) contributions
• Life insurance premiums
• NHIS contributions

3. Register Life Insurance
• Premiums are tax-deductible
• Provides financial protection
• Reduces taxable income

4. Keep Accurate Records
• All receipts and expense documentation
• Bank statements
• Proof of deductible expenses

For Freelancers & Self-Employed:
1. Register as Small Business
• If under ₦25m revenue, you may pay 0% CIT
• Keep revenue documentation

2. Track All Business Expenses
Deductible expenses include:
• Office rent/workspace
• Internet and phone bills
• Computer/equipment
• Professional development
• Software subscriptions
• Transportation (business-related)
• Marketing and advertising

3. Separate Personal & Business Finances
• Open business bank account
• Don't mix funds
• Makes accounting easier

4. Consider Incorporation
• May offer tax advantages
• Depending on income level
• Consult tax professional

For Businesses:
1. Utilize Pioneer Status
• Tax holiday for qualifying industries
• Apply through NIPC

2. Claim Capital Allowances
• Depreciation on assets
• Reduces taxable profit

3. R&D Tax Credits
• If engaged in research/development
• Special deductions may apply

4. Export Incentives
• Export-oriented businesses may get benefits

5. Employ Nigerians
• Employment tax credits
• Training expenses deductible

What NOT to Do (Illegal):
❌ Underreporting income
❌ Fake invoices or receipts
❌ Not filing returns
❌ Hiding foreign accounts
❌ Using personal accounts to hide business income
❌ Cash-only transactions to avoid records
❌ Not issuing receipts/invoices

These can lead to:
• Heavy fines
• Interest charges
• Asset seizure
• Criminal prosecution
• Imprisonment

Best Practices:
✅ File returns on time (even if no tax due)
✅ Keep records for at least 6 years
✅ Respond promptly to tax notices
✅ Use licensed tax consultants
✅ Pay taxes as they fall due
✅ Request tax clearance annually
✅ Stay updated on tax law changes

Where to Learn More:
• NRS website and publications
• Tax professional associations
• Accounting firms
• Legal Aid Council
• This app's AI for quick questions

Remember: Tax planning is legal, tax evasion is not. Always stay within the law.`,
      },
    ],
  },
];
