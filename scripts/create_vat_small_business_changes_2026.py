#!/usr/bin/env python3
"""
Create PDF for VAT and Small Business Changes under Nigeria Tax Act 2025.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "vat_small_business_changes_2026.pdf"

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
    title = Paragraph("<b>VALUE ADDED TAX (VAT) AND<br/>SMALL BUSINESS TAX CHANGES<br/>UNDER THE NIGERIA TAX ACT, 2025</b>", styles['Center'])
    elements.append(title)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph(
        "The Nigeria Tax Act, 2025 introduces significant reforms to Value Added Tax (VAT) administration and provides unprecedented relief "
        "for small and medium-sized enterprises (SMEs). This document outlines the key changes, their practical implications, and compliance "
        "requirements for businesses operating in Nigeria from January 1, 2026.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "These reforms are designed to reduce the tax burden on the majority of Nigerian businesses, simplify compliance procedures, broaden the "
        "tax base through improved coverage of the digital economy, and enhance revenue transparency across all tiers of government.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # VAT Rate
    elements.append(Paragraph("<b>VAT RATE: NO INCREASE</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Contrary to speculation and misinformation that circulated in late 2025, the standard VAT rate remains unchanged at <b>7.5%</b>. "
        "This rate was set by the Finance Act, 2020 and is retained under the Nigeria Tax Act, 2025.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Federal Government, through the Presidential Committee on Fiscal Policy and Tax Reforms, has explicitly confirmed that there are no plans "
        "to increase VAT rates in the immediate or near term. The focus of the reforms is on expanding the tax base and improving compliance, not on "
        "raising tax rates.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "All taxable supplies of goods and services connected to Nigeria remain subject to the 7.5% VAT rate, unless specifically exempted or zero-rated "
        "as outlined in the sections below.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # VAT Coverage
    elements.append(Paragraph("<b>EXPANDED VAT COVERAGE</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Digital Economy and Non-Resident Suppliers</b>", styles['Heading2']))
    elements.append(Paragraph(
        "One of the most significant changes under the Nigeria Tax Act, 2025 is the formal inclusion of digital services and e-commerce transactions "
        "in the VAT net. Previously, many digital platforms and non-resident service providers operated in a regulatory grey area, resulting in "
        "substantial revenue leakage.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("Under the new law:", styles['Justify']))
    elements.append(Spacer(1, 8))

    digital_vat = [
        "<b>Non-resident suppliers</b> of digital services, software, streaming content, online advertising, cloud services, and other digital products "
        "consumed in Nigeria are now required to register for VAT and remit the tax to the Nigeria Revenue Service (NRS).",
        "<b>E-commerce platforms</b> (both local and foreign) facilitating the sale of goods or services to Nigerian customers must collect and remit VAT "
        "on behalf of sellers, where applicable.",
        "<b>Marketplace facilitators</b> such as ride-hailing apps, food delivery platforms, and freelance marketplaces are deemed to be making taxable supplies "
        "and must account for VAT on their commissions and service fees."
    ]
    for point in digital_vat:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This expansion aligns Nigeria with international best practices and ensures that foreign digital service providers contribute fairly to Nigeria's "
        "revenue base, creating a level playing field for local businesses.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Input VAT Recovery</b>", styles['Heading2']))
    elements.append(Paragraph(
        "A major improvement under the Nigeria Tax Act, 2025 is the expanded scope for input VAT recovery. Previously, businesses faced significant challenges "
        "in claiming credit for VAT paid on capital expenditure and input services, leading to 'cascading' tax burdens.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("The new law provides that:", styles['Justify']))
    elements.append(Spacer(1, 8))

    input_vat = [
        "Registered businesses may claim input VAT on <b>all purchases</b> related to their taxable supplies, including services and fixed assets (capital goods).",
        "Input VAT is fully recoverable for businesses making taxable (standard-rated or zero-rated) supplies.",
        "Businesses making both taxable and exempt supplies must apportion input VAT and may only recover the portion attributable to taxable activities.",
        "The time limit for claiming input VAT is six years from the date of the transaction, provided proper documentation (tax invoices) is maintained."
    ]
    for point in input_vat:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This reform significantly reduces the effective tax burden on businesses, particularly in capital-intensive sectors such as manufacturing, infrastructure, "
        "and telecommunications.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # VAT Exemptions
    elements.append(Paragraph("<b>VAT EXEMPTIONS AND ZERO-RATED ITEMS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Act, 2025 distinguishes between <b>exempt</b> supplies (which do not attract VAT and do not allow input VAT recovery) and "
        "<b>zero-rated</b> supplies (which are taxed at 0% but allow full input VAT recovery). This distinction is critical for businesses in determining "
        "their VAT compliance obligations.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Exempt Supplies</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The following supplies are exempt from VAT (no VAT charged, no input VAT recovery):",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    exempt_items = [
        "<b>Baby products:</b> Diapers, baby formula, baby food, and essential baby care items.",
        "<b>Agricultural equipment:</b> Tractors, ploughs, harvesters, irrigation systems, and other farming implements.",
        "<b>Educational and cultural performances:</b> Theatre productions, concerts, exhibitions (excluding commercial entertainment).",
        "<b>Donor-funded humanitarian goods:</b> Relief materials, medical supplies, and food aid provided by recognized international organizations.",
        "<b>Real estate transactions:</b> Sale and lease of land and buildings (residential and commercial).",
        "<b>Financial services:</b> Lending, deposit-taking, foreign exchange transactions, life insurance, securities trading (subject to specific conditions).",
        "<b>Medical and healthcare services:</b> Consultations, diagnostic tests, surgery, and hospitalization (excluding cosmetic procedures).",
        "<b>Public transportation:</b> Intra-city bus services, train services, and other mass transit systems."
    ]
    for item in exempt_items:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Zero-Rated Supplies</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The following supplies are zero-rated (VAT charged at 0%, but suppliers may recover input VAT):",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    zero_rated_items = [
        "<b>Basic food items:</b> Rice, beans, yam, cassava, maize, millet, bread, and other staple foods essential for nutrition.",
        "<b>Medical and pharmaceutical products:</b> Prescription drugs, vaccines, medical devices, hospital equipment.",
        "<b>Educational materials:</b> Textbooks, instructional materials, stationery for primary and secondary education.",
        "<b>Electricity:</b> Supply of power from the national grid and independent power producers (residential and commercial).",
        "<b>Tuition and educational services:</b> Fees charged by nursery, primary, secondary, and tertiary educational institutions (public and private).",
        "<b>Exported goods and services:</b> All goods and services supplied for consumption outside Nigeria (subject to documentary evidence).",
        "<b>Electric vehicles and components:</b> Battery electric vehicles (BEVs), hybrid vehicles, charging infrastructure, and related parts.",
        "<b>Renewable energy equipment:</b> Solar panels, wind turbines, biogas systems, and related installation services."
    ]
    for item in zero_rated_items:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "The zero-rating of basic food, education, healthcare, and electricity is designed to reduce the cost of living for ordinary Nigerians and ensure that "
        "essential goods and services remain affordable.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # VAT Distribution
    elements.append(Paragraph("<b>VAT DISTRIBUTION FORMULA REFORMS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Act, 2025 introduces a revised formula for distributing VAT revenue among the federal, state, and local governments. This change has been "
        "one of the most debated aspects of the tax reforms, particularly among state governments.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Previous Distribution Formula</b>", styles['Heading2']))
    elements.append(Paragraph("Under the old VAT Act, revenue was distributed as follows:", styles['Justify']))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph("• <b>50%</b> - Equally distributed among all states and the FCT (horizontal equity)", styles['BodyText']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>30%</b> - Based on population (derivation by headcount)", styles['BodyText']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>20%</b> - Based on place of collection (derivation by location of VAT remittance)", styles['BodyText']))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>New Distribution Formula (Effective January 1, 2026)</b>", styles['Heading2']))
    elements.append(Paragraph("The Nigeria Tax Act, 2025 adjusts the formula to:", styles['Justify']))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph("• <b>50%</b> - Equally distributed among all states and the FCT (unchanged)", styles['BodyText']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>20%</b> - Based on population (reduced from 30%)", styles['BodyText']))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>30%</b> - Based on consumption (increased from 20%, but methodology changed)", styles['BodyText']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Key Change: From 'Place of Collection' to 'Place of Consumption'</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The most significant reform is the shift from <b>derivation by place of collection</b> to <b>derivation by place of consumption</b>. Under the old system, "
        "VAT revenue was allocated based on where companies remitted their taxes, which disproportionately favored commercial hubs like Lagos (where most corporate "
        "headquarters are located).",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Under the new system, VAT is attributed to the state where goods or services are actually consumed. This is tracked through:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    consumption_tracking = [
        "Point-of-sale (POS) transaction data showing where purchases were made.",
        "Delivery addresses for e-commerce and online transactions.",
        "Service delivery locations for professional and technical services.",
        "Customer billing addresses for utilities, telecommunications, and digital services."
    ]
    for point in consumption_tracking:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This reform is expected to result in a more equitable distribution of VAT revenue, benefiting states with large consumer populations even if they do not "
        "host major corporate headquarters. However, it has raised concerns among states like Lagos, which may see reductions in their VAT allocations.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Small Business Relief
    elements.append(Paragraph("<b>UNPRECEDENTED RELIEF FOR SMALL BUSINESSES</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Act, 2025 provides the most generous tax relief for small and medium-sized enterprises (SMEs) in Nigeria's fiscal history. These measures "
        "are designed to reduce compliance burdens, lower operating costs, and stimulate entrepreneurship and job creation.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Complete Exemption for 97% of Small Businesses</b>", styles['Heading2']))
    elements.append(Paragraph(
        "According to official statements from the Presidential Committee on Fiscal Policy and Tax Reforms, approximately <b>97% of small businesses in Nigeria</b> "
        "will be completely exempt from the following taxes:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    exempted_taxes = [
        "<b>Corporate Income Tax (CIT):</b> Companies with annual turnover of ₦50 million or less pay 0% CIT.",
        "<b>Value Added Tax (VAT):</b> Small businesses below the mandatory VAT registration threshold are not required to register or charge VAT.",
        "<b>Withholding Tax (WHT):</b> Small businesses are exempt from WHT deductions on certain qualifying transactions."
    ]
    for tax in exempted_taxes:
        elements.append(Paragraph(f"• {tax}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This exemption applies automatically based on turnover. Eligible businesses do not need to apply for exemption certificates; they simply file returns "
        "indicating their turnover level and claim the 0% rate.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Who Qualifies as a 'Small Business'?</b>", styles['Heading2']))
    elements.append(Paragraph("Under the Nigeria Tax Act, 2025, a small business is defined as:", styles['Justify']))
    elements.append(Spacer(1, 8))

    qualification_criteria = [
        "<b>Annual Turnover:</b> Total revenue of ₦50 million or less in a tax year.",
        "<b>Business Structure:</b> The relief applies to companies, sole proprietorships, partnerships, and other business entities.",
        "<b>Business Activities:</b> The relief covers all lawful business activities (trading, manufacturing, services, etc.), excluding illegal enterprises.",
        "<b>Compliance Requirement:</b> Businesses must file annual tax returns (even if reporting zero tax liability) to maintain eligibility."
    ]
    for criterion in qualification_criteria:
        elements.append(Paragraph(f"• {criterion}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Progressive Taxation for Medium and Large Businesses</b>", styles['Heading2']))
    elements.append(Paragraph("Businesses with turnover exceeding ₦50 million are subject to the following rates:", styles['Justify']))
    elements.append(Spacer(1, 8))

    progressive_rates = [
        "<b>Turnover above ₦50 million:</b> Standard Corporate Income Tax (CIT) rate of 30%, plus a 4% Development Levy on assessable profits.",
        "<b>VAT registration mandatory:</b> Businesses with annual turnover above ₦25 million must register for VAT and charge 7.5% on taxable supplies.",
        "<b>Large companies (turnover > ₦50 billion):</b> Subject to additional reporting requirements, including country-by-country reporting for multinationals "
        "and minimum Effective Tax Rate (ETR) rules aligned with OECD Base Erosion and Profit Shifting (BEPS) standards."
    ]
    for rate in progressive_rates:
        elements.append(Paragraph(f"• {rate}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "Importantly, even large companies will benefit from reduced tax burdens due to the consolidation of multiple sectoral levies (Education Tax, IT Levy, NASENI Levy) "
        "into a single 4% Development Levy, resulting in net savings for most businesses.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Compliance
    elements.append(Paragraph("<b>COMPLIANCE REQUIREMENTS FOR BUSINESSES</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>For Small Businesses (Turnover ≤ ₦50 million)</b>", styles['Heading2']))
    elements.append(Paragraph("Even though exempt from CIT and VAT, small businesses must:", styles['Justify']))
    elements.append(Spacer(1, 8))

    small_biz_compliance = [
        "<b>Obtain a TIN:</b> Register with the NRS and obtain a Tax Identification Number (or use CAC RC Number as TIN for registered companies).",
        "<b>File annual returns:</b> Submit annual tax returns indicating turnover and claiming exemption (0% tax rate).",
        "<b>Maintain records:</b> Keep basic accounting records (receipts, invoices, bank statements) for at least six years.",
        "<b>Issue receipts:</b> Provide customers with receipts for all transactions (even if VAT is not charged).",
        "<b>Monitor turnover:</b> Track annual revenue to determine when mandatory VAT registration or CIT liability is triggered."
    ]
    for req in small_biz_compliance:
        elements.append(Paragraph(f"• {req}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>For VAT-Registered Businesses</b>", styles['Heading2']))
    elements.append(Paragraph("Businesses registered for VAT must:", styles['Justify']))
    elements.append(Spacer(1, 8))

    vat_compliance = [
        "<b>Charge VAT:</b> Add 7.5% VAT to all taxable supplies (unless exempt or zero-rated).",
        "<b>Issue tax invoices:</b> Provide customers with VAT-compliant invoices showing VAT amount separately.",
        "<b>File monthly returns:</b> Submit VAT returns to the NRS by the 21st day of the following month.",
        "<b>Remit VAT collected:</b> Pay net VAT liability (output VAT minus input VAT) within the filing deadline.",
        "<b>Claim input VAT:</b> Maintain proper documentation (supplier tax invoices) to support input VAT claims.",
        "<b>Keep VAT records:</b> Retain all VAT invoices, returns, and payment receipts for at least six years."
    ]
    for req in vat_compliance:
        elements.append(Paragraph(f"• {req}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>For Digital Service Providers and Non-Residents</b>", styles['Heading2']))
    elements.append(Paragraph("Foreign businesses supplying digital services to Nigerian customers must:", styles['Justify']))
    elements.append(Spacer(1, 8))

    digital_compliance = [
        "<b>Register for VAT:</b> Apply for VAT registration with the NRS, even if no physical presence in Nigeria.",
        "<b>Appoint a local representative:</b> Designate a tax agent or representative in Nigeria (if required by NRS).",
        "<b>Charge VAT:</b> Add 7.5% VAT to invoices for Nigerian customers.",
        "<b>File returns electronically:</b> Submit VAT returns through the NRS online portal.",
        "<b>Remit VAT in Naira:</b> Convert foreign currency receipts to Naira at CBN exchange rates for VAT calculation and remittance."
    ]
    for req in digital_compliance:
        elements.append(Paragraph(f"• {req}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Penalties
    elements.append(Paragraph("<b>PENALTIES FOR NON-COMPLIANCE</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Administration Act, 2025 significantly enhances penalties for tax non-compliance to deter evasion and ensure fairness. However, the "
        "government has emphasized that the primary goal is compliance, not punishment, and taxpayers who demonstrate good-faith efforts to comply will be treated leniently.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    penalties = [
        "<b>Late filing of returns:</b> ₦100,000 penalty in the first month, plus ₦50,000 for each subsequent month of delay.",
        "<b>Late payment of tax:</b> Interest charged at the Central Bank of Nigeria's Monetary Policy Rate (MPR) from the due date until payment.",
        "<b>Failure to register for VAT:</b> Up to ₦5 million penalty for businesses operating above the mandatory registration threshold without registering.",
        "<b>Issuance of fake tax invoices:</b> Criminal prosecution and potential imprisonment in addition to financial penalties.",
        "<b>Deliberate tax evasion or fraud:</b> Criminal prosecution, asset forfeiture, and unlimited financial penalties based on the amount evaded.",
        "<b>Non-compliance with digital reporting requirements:</b> Up to ₦5 million penalty for failure to deploy required technology or submit electronic returns."
    ]
    for penalty in penalties:
        elements.append(Paragraph(f"• {penalty}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "Taxpayers facing genuine difficulties in meeting compliance obligations are encouraged to engage proactively with the NRS to negotiate payment plans or seek "
        "penalty waivers on compassionate grounds.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Conclusion
    elements.append(Paragraph("<b>CONCLUSION: A PRO-BUSINESS REFORM AGENDA</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The VAT and small business provisions of the Nigeria Tax Act, 2025 represent a fundamental shift in Nigeria's approach to taxation. By exempting 97% of small "
        "businesses from major taxes, maintaining the VAT rate at 7.5%, zero-rating essential goods and services, and improving input VAT recovery, the government has "
        "demonstrated a genuine commitment to reducing the tax burden on ordinary Nigerians and small entrepreneurs.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "At the same time, the expansion of VAT coverage to include digital services and non-resident suppliers ensures that the tax system keeps pace with the evolving "
        "economy and captures revenue from previously untaxed activities. The revised VAT distribution formula promises a more equitable sharing of revenue among states, "
        "though it remains a subject of ongoing political debate.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "For businesses, the key to success under the new regime is proactive compliance: understand the rules, maintain proper records, file returns on time, and seek "
        "professional advice when in doubt. The NRS has committed to providing extensive taxpayer education and support services to facilitate smooth transition to the "
        "new tax framework.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "As Nigeria enters this new fiscal era on January 1, 2026, businesses and taxpayers are encouraged to embrace the reforms as an opportunity to build a more "
        "transparent, efficient, and equitable tax system that supports sustainable economic growth and development.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ VAT and Small Business Changes PDF created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_pdf()
