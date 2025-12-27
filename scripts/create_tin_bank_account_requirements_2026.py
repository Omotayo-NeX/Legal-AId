#!/usr/bin/env python3
"""
Create PDF for TIN Bank Account Requirements 2026.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "tin_bank_account_requirements_2026.pdf"

def create_pdf():
    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18,
    )

    elements = []
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER, fontSize=14, spaceAfter=30))

    # Title
    title = Paragraph("<b>TAX IDENTIFICATION NUMBER (TIN)<br/>BANK ACCOUNT REQUIREMENTS 2026<br/>OFFICIAL GUIDANCE AND CLARIFICATIONS</b>", styles['Center'])
    elements.append(title)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph(
        "This document provides comprehensive guidance on the Tax Identification Number (TIN) requirements for bank account operations "
        "beginning January 1, 2026, as mandated under the Nigeria Tax Administration Act, 2025. It consolidates official statements from "
        "the Nigeria Revenue Service (NRS), Federal Ministry of Finance, and the Presidential Committee on Fiscal Policy and Tax Reforms.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Following widespread public concerns and misinformation in December 2025, the Federal Government issued multiple clarifications "
        "to ensure citizens understand the policy, its exemptions, and practical implementation.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Policy Overview
    elements.append(Paragraph("<b>POLICY OVERVIEW</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Legal Basis</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The requirement for TIN in banking transactions is not entirely new to Nigerian law. It was first introduced through the Finance Act, 2020, "
        "which amended Section 10 of the Personal Income Tax Act. However, enforcement was inconsistent due to lack of clear regulatory frameworks "
        "and limited institutional capacity.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Administration Act, 2025 now provides comprehensive legal backing for the mandatory linkage of TIN to financial activities, "
        "including bank account operations. This provision is designed to enhance tax compliance, reduce revenue leakage, and improve the integrity "
        "of Nigeria's taxpayer database.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Implementation Date</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The mandatory TIN requirement for banking transactions takes full effect on January 1, 2026, coinciding with the commencement of the "
        "Nigeria Tax Act, 2025 and the Nigeria Tax Administration Act, 2025.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Banks and other financial institutions have been directed to integrate TIN verification into their account opening and maintenance processes "
        "by this date. The Central Bank of Nigeria (CBN) and the Nigeria Revenue Service (NRS) are coordinating to ensure seamless implementation.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # What the Policy Requires
    elements.append(Paragraph("<b>WHAT THE POLICY REQUIRES</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>For New Bank Accounts</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Beginning January 1, 2026, all taxable individuals and entities seeking to open new bank accounts in Nigeria must provide a valid "
        "Tax Identification Number (TIN) as part of the Know Your Customer (KYC) requirements.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Banks will be required to verify the TIN against the national taxpayer database before approving new account applications. Failure to "
        "provide a valid TIN may result in the bank declining the account opening request.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>For Existing Bank Accounts</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Contrary to widespread misinformation circulated in late December 2025, existing bank account holders will NOT have their accounts blocked "
        "or frozen if they do not have a TIN on January 1, 2026.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Federal Inland Revenue Service (now NRS) has clarified that account holders without a TIN will be asked to supply it 'as time goes on' "
        "through a gradual, customer-friendly process. Banks will engage existing customers to update their records, but no punitive measures such as "
        "account freezing or restriction will be imposed immediately.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Account holders are, however, encouraged to proactively obtain and link their TIN to avoid potential compliance issues in future transactions "
        "such as large transfers, loan applications, or opening additional accounts.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Critical Clarification
    elements.append(Paragraph("<b>CRITICAL CLARIFICATION: NO SEPARATE TIN REQUIRED</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "One of the most important clarifications issued by the NRS in December 2025 is that <b>Nigerians do not need to obtain a separate Tax "
        "Identification Number (TIN) to open or operate bank accounts.</b>",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>How the System Works</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Nigeria's tax administration system has been designed to integrate seamlessly with existing national identification infrastructure. "
        "Specifically:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    integration_points = [
        "<b>For Individuals:</b> Your National Identification Number (NIN) issued by the National Identity Management Commission (NIMC) serves as your TIN. "
        "When you provide your NIN to the bank, it is automatically linked to the tax system behind the scenes.",
        "<b>For Companies and Businesses:</b> Your Corporate Affairs Commission (CAC) Registration Number (RC Number) serves as your TIN. Upon registration "
        "with CAC, your RC Number is automatically recognized as your TIN in the NRS database.",
        "<b>For Other Entities:</b> Trusts, estates, clubs, and other taxable entities registered with CAC or other regulatory bodies will similarly have their "
        "registration numbers integrated into the TIN system."
    ]
    for point in integration_points:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This integration eliminates the need for individuals and businesses to make separate applications for TIN. The system operates in the background, "
        "ensuring that taxpayer identification is seamless and non-disruptive to banking activities.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Who is Exempt
    elements.append(Paragraph("<b>WHO IS EXEMPT FROM TIN REQUIREMENT?</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The TIN requirement applies only to <b>taxable persons</b>—that is, individuals and entities who are liable to pay tax under Nigerian law. "
        "The following categories of persons are <b>exempt</b> and do not need to provide TIN to open or operate bank accounts:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    exemptions = [
        "<b>Students:</b> Full-time students who do not earn taxable income are exempt from the TIN requirement. They may open and operate student "
        "accounts using their school identification and NIN without needing a separate TIN linkage.",
        "<b>Dependents and Minors:</b> Children and dependents (such as those under the age of 18 or those without independent sources of income) are "
        "not required to have TIN to operate bank accounts opened on their behalf by parents or guardians.",
        "<b>Non-Income Earners:</b> Individuals who genuinely have no source of income (e.g., the unemployed, retirees living solely on pensions below "
        "the taxable threshold, or persons entirely dependent on family support) are not required to link TIN to their accounts.",
        "<b>Religious and Charitable Organizations:</b> Registered religious bodies, charities, and non-profit organizations whose income is derived "
        "exclusively from donations and grants (and not from trade or business activities) may be exempt, subject to confirmation of their tax-exempt status."
    ]
    for exemption in exemptions:
        elements.append(Paragraph(f"• {exemption}", styles['BodyText']))
        elements.append(Spacer(1, 10))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "It is important to note that exemption from TIN requirement does not mean exemption from providing identification. All bank account holders "
        "must still comply with standard Know Your Customer (KYC) requirements, including providing valid NIN or other acceptable forms of identification.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Fact Check
    elements.append(Paragraph("<b>FACT-CHECK: DEBUNKING MISINFORMATION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "In the final days of December 2025, numerous false claims circulated on social media and messaging platforms, causing unnecessary panic among "
        "Nigerian bank account holders. Below are the most common falsehoods, alongside the verified facts:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    fact_checks = [
        {
            "claim": "Your bank account will be blocked from January 1, 2026 if you don't have TIN.",
            "fact": "<b>FALSE.</b> The NRS and CBN have confirmed that existing accounts will NOT be blocked. Account holders will be asked to provide TIN "
            "gradually, but no punitive action will be taken on January 1, 2026."
        },
        {
            "claim": "You need to visit FIRS/NRS office to apply for a separate TIN before opening a bank account.",
            "fact": "<b>FALSE.</b> You do not need a separate TIN. Your NIN (for individuals) or RC Number (for companies) automatically serves as your TIN. "
            "No additional application is required."
        },
        {
            "claim": "Students and unemployed persons cannot open bank accounts from January 2026.",
            "fact": "<b>FALSE.</b> Students, dependents, and non-income earners are exempt from the TIN requirement and can continue to open and operate "
            "accounts using their NIN and other standard KYC documents."
        },
        {
            "claim": "The government will monitor and tax every bank transaction from January 1, 2026.",
            "fact": "<b>MISLEADING.</b> While the TIN linkage improves the ability of tax authorities to track taxable income and enforce compliance, it does "
            "not mean that every transaction is taxed. Tax liability is determined based on income earned, not on routine banking activities."
        },
        {
            "claim": "Foreigners and non-residents cannot open Nigerian bank accounts without TIN.",
            "fact": "<b>PARTIALLY TRUE.</b> Non-resident individuals and foreign entities deriving income from Nigeria are required to register and obtain a "
            "TIN if they engage in taxable activities. However, diplomatic personnel and certain categories of expatriates may be exempt under Double Taxation "
            "Agreements (DTAs) or diplomatic conventions."
        }
    ]

    for idx, fc in enumerate(fact_checks, 1):
        elements.append(Paragraph(f"<b>Claim {idx}:</b> {fc['claim']}", styles['BodyText']))
        elements.append(Spacer(1, 6))
        elements.append(Paragraph(f"<b>Fact:</b> {fc['fact']}", styles['BodyText']))
        elements.append(Spacer(1, 12))

    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # How to Obtain TIN
    elements.append(Paragraph("<b>HOW TO OBTAIN OR VERIFY YOUR TIN</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>For Individuals</b>", styles['Heading2']))
    elements.append(Paragraph(
        "If you already have a National Identification Number (NIN), you automatically have a TIN. There is no separate application process. "
        "To verify your TIN:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    individual_steps = [
        "Visit the NRS online portal at www.nrs.gov.ng (or successor domain as announced).",
        "Navigate to the 'TIN Verification' section.",
        "Enter your NIN and personal details (name, date of birth).",
        "The system will display your TIN, which is typically identical to or directly derived from your NIN.",
        "If you encounter any discrepancies, contact the NRS helpdesk or visit your nearest tax office for assistance."
    ]
    for idx, step in enumerate(individual_steps, 1):
        elements.append(Paragraph(f"{idx}. {step}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "If you do not yet have a NIN, you should visit a NIMC enrollment center to register. Once you receive your NIN, it will automatically serve "
        "as your TIN for tax purposes.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>For Businesses and Companies</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Companies registered with the Corporate Affairs Commission (CAC) automatically receive a TIN upon registration. Your CAC RC Number is your TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    business_steps = [
        "Locate your Certificate of Incorporation or Business Name Registration Certificate issued by CAC.",
        "Your RC Number (Company Registration Number or Business Name Registration Number) is your TIN.",
        "Provide this number to your bank when opening a corporate account.",
        "For verification or if you need a formal TIN certificate, visit the NRS online portal or your nearest tax office."
    ]
    for idx, step in enumerate(business_steps, 1):
        elements.append(Paragraph(f"{idx}. {step}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>For Special Cases</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Trusts, estates, partnerships, unincorporated associations, and other entities should contact the NRS directly for guidance on TIN registration. "
        "The NRS has established dedicated help desks and online support channels to assist these categories.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Practical Steps
    elements.append(Paragraph("<b>PRACTICAL STEPS FOR BANK CUSTOMERS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>If You Are Opening a New Account (From January 1, 2026)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "When opening a new bank account from January 1, 2026, follow these steps:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    new_account_steps = [
        "Ensure you have your valid National Identification Number (NIN) or CAC Registration Number (for businesses).",
        "Visit the bank with all required KYC documents (NIN slip, proof of address, passport photograph, etc.).",
        "Provide your NIN or RC Number to the bank. The bank will verify it against the NRS database.",
        "Complete the standard account opening forms and procedures.",
        "Your account will be opened and linked to your TIN automatically."
    ]
    for idx, step in enumerate(new_account_steps, 1):
        elements.append(Paragraph(f"{idx}. {step}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>If You Have an Existing Account</b>", styles['Heading2']))
    elements.append(Paragraph(
        "If you currently have a bank account and are unsure whether your TIN is linked:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    existing_account_steps = [
        "Contact your bank via phone, email, or by visiting a branch to inquire if your TIN is already on file.",
        "Many banks already collected NIN during previous KYC updates; if so, your TIN may already be linked.",
        "If not, the bank will request that you provide your NIN or RC Number. You can do this in person, via online banking platforms, or through the bank's mobile app.",
        "Update your records at your convenience. There is no immediate penalty for delay, but proactive compliance is encouraged.",
        "If you are exempt (student, dependent, non-income earner), inform your bank and provide supporting documentation (e.g., student ID, birth certificate for minors)."
    ]
    for idx, step in enumerate(existing_account_steps, 1):
        elements.append(Paragraph(f"{idx}. {step}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Enforcement
    elements.append(Paragraph("<b>ENFORCEMENT AND COMPLIANCE TIMELINE</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Federal Government has adopted a phased and customer-friendly approach to enforcement of the TIN-bank account linkage policy. "
        "The implementation timeline is as follows:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    timeline = [
        "<b>January 1, 2026:</b> TIN requirement takes effect for all new bank accounts. Banks begin gradual engagement with existing account holders.",
        "<b>Q1 2026 (January - March):</b> Grace period for existing account holders to update their records. Banks conduct awareness campaigns and provide "
        "support to customers to facilitate TIN linkage.",
        "<b>Q2 2026 (April - June):</b> Banks intensify engagement with non-compliant accounts. Customers may receive SMS, email, or in-app notifications "
        "requesting TIN updates. No penalties imposed during this period.",
        "<b>Q3 2026 onwards:</b> Gradual implementation of restrictions on non-compliant accounts for high-value transactions (e.g., transfers above ₦5 million, "
        "foreign exchange transactions, loan applications). The specific thresholds and restrictions will be announced by CBN and NRS."
    ]
    for item in timeline:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 10))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "The government has emphasized that the goal is compliance, not punishment. Taxpayers who demonstrate genuine efforts to comply will not face "
        "punitive measures. However, deliberate non-compliance or provision of false information may attract penalties under the Nigeria Tax Administration Act, 2025.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Conclusion
    elements.append(Paragraph("<b>CONCLUSION AND RECOMMENDATIONS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The TIN-bank account linkage policy is a key component of Nigeria's broader fiscal modernization agenda. When implemented effectively, it will enhance "
        "tax compliance, reduce revenue leakage, and improve the integrity of Nigeria's financial system.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "However, the success of this policy depends on clear communication, robust public education, and a customer-centric approach by banks and tax authorities. "
        "The Federal Government has committed to a gradual, non-punitive implementation process that prioritizes citizen convenience and addresses legitimate concerns.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Recommendations for Bank Customers:</b>", styles['Heading2']))
    elements.append(Spacer(1, 8))

    recommendations = [
        "Verify that you have a valid NIN (individuals) or RC Number (businesses). If not, register immediately with NIMC or CAC.",
        "Contact your bank to confirm whether your TIN is already linked to your account. Update if necessary.",
        "Keep copies of your NIN slip, TIN verification printout, and other relevant documents for future reference.",
        "If you qualify for exemption (student, dependent, non-income earner), inform your bank and provide supporting documentation.",
        "Ignore unverified social media claims and rely only on official statements from NRS, CBN, and Federal Ministry of Finance.",
        "For any questions or difficulties, contact the NRS helpdesk or visit your nearest tax office for assistance."
    ]
    for idx, rec in enumerate(recommendations, 1):
        elements.append(Paragraph(f"{idx}. {rec}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "By following these guidelines and staying informed, Nigerian bank customers can navigate the new requirements smoothly and contribute to building "
        "a more transparent and efficient fiscal system.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ TIN Bank Account Requirements PDF created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_pdf()
