#!/usr/bin/env python3
"""
Create PDF for comprehensive Tax Reform Laws overview.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "nigeria_2025_tax_reform_laws_overview.pdf"

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
    title = Paragraph("<b>A NEW FISCAL FRAMEWORK:<br/>KEY PROVISIONS OF NIGERIA'S 2025 TAX REFORM LAWS</b>", styles['Center'])
    elements.append(title)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph(
        "On 26 June 2025, President Bola Ahmed Tinubu signed into law a historic package of tax reform legislation, "
        "marking the most comprehensive overhaul of Nigeria's fiscal architecture in decades. The four Acts: The Nigeria "
        "Tax Act, Nigeria Revenue Service (Establishment) Act, Nigeria Tax Administration Act, and the Joint Revenue Board "
        "(Establishment) Act, seek to streamline revenue administration, enhance compliance, strengthen intergovernmental "
        "coordination, and reposition the tax system to support inclusive growth.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "By consolidating over a dozen outdated statutes and introducing modern mechanisms for enforcement, digitalisation, "
        "and dispute resolution, these reforms are expected to significantly reshape Nigeria's fiscal future. This article "
        "outlines the key provisions of each law and examines their potential impact on economic growth in Nigeria.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Joint Revenue Board Act
    elements.append(Paragraph("<b>JOINT REVENUE BOARD (ESTABLISHMENT) ACT, 2025</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Joint Revenue Board (Establishment) Act, 2025, establishes the Joint Revenue Board (JRB) to lead "
        "intergovernmental coordination on tax policy and administration in Nigeria. This reform responds to persistent "
        "calls for a harmonised, collaborative approach to revenue generation across the federal, state, and local levels.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The JRB is mandated to serve as the apex coordinating entity for tax administration across the Federation. It is "
        "empowered to promote consistency, resolve jurisdictional overlaps, and provide strategic guidance on fiscal matters "
        "that cut across multiple tiers of government.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Key Functions
    elements.append(Paragraph("<b>Key Functions and Powers</b>", styles['Heading2']))
    elements.append(Paragraph("The JRB is tasked with a comprehensive range of responsibilities, including:", styles['Justify']))
    elements.append(Spacer(1, 8))

    jrb_functions = [
        "Coordinating the integration and maintenance of a national taxpayer identification database (TINs);",
        "Advising on double taxation matters and promoting the harmonisation of tax rates and practices across Nigeria;",
        "Publishing tax expenditure reports, including analyses of waivers, exemptions, and incentives issued by all levels of government;",
        "Facilitating tax policy reform, capacity building, and the accreditation of tax agents;",
        "Undertaking taxpayer behaviour research, compliance audits, and policy impact assessments."
    ]
    for func in jrb_functions:
        elements.append(Paragraph(f"• {func}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "To support its operations, the Board is funded by a mix of annual membership fees from participating institutions, "
        "government-approved loans, grants, and income from service charges and investments. It is exempt from income tax "
        "obligations, although it must still deduct and remit PAYE and other statutory withholdings.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The National Economic Council is vested with supervisory authority and may issue directives to the JRB on any fiscal "
        "or revenue matter in the national interest.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Composition
    elements.append(Paragraph("<b>Composition and Governance</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The JRB's membership includes the chairpersons of all State Internal Revenue Services, the FCT-IRS, and representatives "
        "of key federal agencies such as the Nigeria Revenue Service, Nigeria Customs Service, Nigeria Immigration Service, FRSC, "
        "NIMC, and the Revenue Mobilisation Allocation and Fiscal Commission (RMAFC). The Board may co-opt experts or other "
        "institutions as needed, subject to a cap of two additional members.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Administrative leadership is vested in a full-time Secretary-General, appointed through a transparent process, and "
        "supported by zonal and departmental directors.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Tax Appeal Tribunal
    elements.append(Paragraph("<b>Tax Appeal Tribunal</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Act establishes the Tax Appeal Tribunal, designed to ensure that disputes arising from tax assessments and "
        "enforcement can be resolved swiftly, professionally, and independently.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph(
        "Each zone will host a division of the Tribunal, composed of five members, including a legal practitioner of at least "
        "ten years' standing as Chairperson. The Tribunal has jurisdiction over disputes arising under any federal or state tax "
        "legislation, and its decisions may be appealed to the Federal High Court on points of law.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Tax Ombud
    elements.append(Paragraph("<b>Office of the Tax Ombud</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Act also established the Office of the Tax Ombud to receive, investigate, and resolve complaints about administrative "
        "malpractice, delay, or unfair treatment by revenue agencies.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph(
        "Although it does not possess the power to interpret tax laws or override assessments, the Ombud may investigate any "
        "non-compliance with procedural requirements and can escalate unresolved issues to the National Assembly. It is also "
        "authorised to recommend corrective action, report abuse of office, and even initiate legal proceedings in defence of "
        "taxpayer rights.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Nigeria Tax Act
    elements.append(Paragraph("<b>NIGERIA TAX ACT, 2025</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Act, 2025 repeals and consolidates over a dozen federal tax laws into a single unified statute. It "
        "replaces legacy laws such as the Companies Income Tax Act (CITA), Personal Income Tax Act (PITA), Capital Gains Tax "
        "Act (CGTA), Value Added Tax Act, and the Stamp Duties Act, among others. This consolidation aims to reduce fragmentation, "
        "promote consistency, and modernise Nigeria's tax framework for a digital and globally integrated economy.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Corporate Income Tax
    elements.append(Paragraph("<b>Corporate and Business Income Taxation</b>", styles['Heading2']))
    elements.append(Paragraph("The Act introduces a clearer and more progressive corporate income tax structure:", styles['Justify']))
    elements.append(Spacer(1, 8))

    corp_tax_points = [
        "Small companies (with an annual turnover of ₦50 million or less) are subject to a 0% companies income tax rate.",
        "Other companies are taxed at a rate of 30%, alongside a 4% Development Levy on assessable profits, which replaces "
        "multiple sectoral levies (e.g., Education Tax, IT Levy, NASENI Levy)."
    ]
    for point in corp_tax_points:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "It also introduces a minimum Effective Tax Rate (ETR) of 15%, in line with global tax reforms. This applies to "
        "multinational group entities with a consolidated global turnover of at least €750 million, or Nigerian companies with "
        "turnover exceeding ₦50 billion. Where a foreign subsidiary pays tax at a rate below this threshold, the Nigerian parent "
        "is liable to pay the top-up tax.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "To discourage tax base erosion, the Act incorporates Controlled Foreign Company (CFC) rules, bringing undistributed "
        "passive income of low-taxed foreign affiliates into Nigeria's tax net.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Capital Gains
    elements.append(Paragraph("<b>Capital Gains Tax</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Capital gains tax now applies to disposals of digital and virtual assets, such as cryptocurrencies, tokens, and digital "
        "property. Reliefs are available for reinvested share sales, principal private residences, and certain personal-use assets. "
        "Notably, gains on share disposals below ₦150 million (subject to a ₦10 million gain limit) are exempt.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Personal Income Tax
    elements.append(Paragraph("<b>Personal Income Tax</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Act introduces a progressive personal income tax regime, with tax rates ranging from 0% to 25%, and improved "
        "deductions that support equitable burden-sharing. Individuals earning ₦800,000 or less annually are fully exempt from "
        "tax. A key reform includes a 20% rent deduction, capped at ₦500,000, to ease the cost of housing for employees and "
        "low-income earners.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # VAT
    elements.append(Paragraph("<b>Value Added Tax (VAT)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "VAT remains at 7.5%, but the Act substantially revises the scope and mechanics of the tax:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    vat_points = [
        "All taxable supplies of goods and services connected to Nigeria are chargeable.",
        "Non-resident suppliers are now required to register and remit VAT, bringing e-commerce and digital services squarely "
        "into the tax net.",
        "Input VAT recovery has been expanded, especially for capital expenditure and input services, reducing cascading tax burdens."
    ]
    for point in vat_points:
        elements.append(Paragraph(f"• {point}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph("The Act also refines the treatment of exempt and zero-rated goods and services:", styles['Justify']))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph(
        "<b>Exemptions include:</b> Baby products, agricultural equipment, educational performances, donor-funded humanitarian "
        "goods, real estate, and financial securities.",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 6))

    elements.append(Paragraph(
        "<b>Zero-rated items include:</b> Basic food, medical and pharmaceutical products, educational materials, electricity, "
        "medical services, tuition at all education levels, exported goods and services, and electric vehicles (including parts).",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 16))

    # Fossil Fuel Surcharge
    elements.append(Paragraph("<b>Fossil Fuel Surcharge</b>", styles['Heading2']))
    elements.append(Paragraph(
        "A 5% surcharge is introduced on chargeable fossil fuel products (excluding CNG, LPG, and household kerosene), signalling "
        "Nigeria's fiscal shift towards cleaner energy and climate-responsive taxation.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Tax Incentives
    elements.append(Paragraph("<b>Tax Incentives and Reliefs</b>", styles['Heading2']))
    elements.append(Paragraph("The Act introduces a consolidated tax incentives framework to support national development objectives. Key provisions include:", styles['Justify']))
    elements.append(Spacer(1, 8))

    incentives = [
        "Income tax exemptions for charitable, educational, and agricultural institutions, provided their income is not derived from trade or business.",
        "Economic Development Tax Incentives (EDTI) for companies operating in priority sectors (e.g., manufacturing, mining, renewable energy, and agro-processing). "
        "Eligible businesses receive a 5% tax credit for qualifying capital expenditures over five years.",
        "Additional deductions are allowed for R&D expenditure, infrastructure investments, and donations to eligible public-interest institutions."
    ]
    for incentive in incentives:
        elements.append(Paragraph(f"• {incentive}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 24))
    elements.append(PageBreak())

    # Nigeria Tax Administration Act
    elements.append(Paragraph("<b>NIGERIA TAX ADMINISTRATION ACT, 2025</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Tax Administration Act, 2025 (NTAA) introduces a unified procedural framework for the assessment, collection, "
        "enforcement, and administration of taxes across all levels of government. It responds to years of fragmented tax administration "
        "by offering consistency, clarity of roles, and a rules-based system that aligns with global good practice.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Act promotes fiscal federalism by clearly distinguishing the tax jurisdictions of different tiers of government:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    jurisdiction = [
        "The Nigeria Revenue Service (NRS) is responsible for administering corporate income tax, value-added tax (VAT), taxes on petroleum operations, "
        "non-resident taxation, and national tax incentives.",
        "State and FCT tax authorities retain powers over personal income tax for resident individuals (excluding military and diplomatic personnel) and local taxes."
    ]
    for item in jurisdiction:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    # Digital Identity
    elements.append(Paragraph("<b>Digital Identity and Compliance</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Act mandates the issuance and use of a Taxpayer Identification Number (TIN) for every taxable person. This TIN must be "
        "linked to all tax transactions and financial activities, reinforcing the integrity of taxpayer records. Non-resident businesses "
        "and digital service providers deriving income from Nigeria must also register and obtain a TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "To support transparency in the digital economy, Virtual Asset Service Providers (VASPs), including crypto exchanges and financial "
        "institutions, are required to report significant transactions. Banks must provide quarterly returns on customer data and cumulative "
        "inflows or outflows exceeding ₦25 million (for individuals) and ₦100 million (for companies).",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The law also introduces a mandatory disclosure regime for tax planning arrangements, especially those structured primarily to "
        "obtain a tax advantage.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Assessments
    elements.append(Paragraph("<b>Assessments, Returns and Refunds</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The NTAA formalises Nigeria's self-assessment regime, empowering taxpayers to file their own returns and calculate tax liability. "
        "However, tax authorities retain the right to issue administrative assessments where returns are not filed or appear inaccurate.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Assessments must generally be made within six years of the relevant tax period — unless there is fraud, wilful default, or gross "
        "misstatement, in which case there is no time limit. All taxes are payable in the currency of the transaction, with petroleum taxes "
        "payable in US Dollars.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Act provides for tax refunds to be processed within 90 days (or 30 days for VAT), and also allows taxpayers to apply overpaid "
        "taxes to future liabilities (set-off). Claims must be made within six years and must be accompanied by proper documentation.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Audit and Enforcement
    elements.append(Paragraph("<b>Audit, Enforcement and Penalties</b>", styles['Heading2']))
    elements.append(Paragraph("Tax authorities are granted broad investigative powers. These include the right to:", styles['Justify']))
    elements.append(Spacer(1, 8))

    audit_powers = [
        "Call for documents and inspect books and records, both physical and electronic;",
        "Enter premises (with judicial warrant for private residences);",
        "Remove or copy evidence;",
        "Appoint third-party collection agents where necessary;",
        "Distrain (seize and sell assets) of defaulting taxpayers, with court approval required for immovable property."
    ]
    for power in audit_powers:
        elements.append(Paragraph(f"• {power}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "Penalties are significantly enhanced. Late filing attracts a ₦100,000 penalty in the first month and ₦50,000 for each subsequent "
        "month, while interest accrues at the Central Bank's Monetary Policy Rate (or SOFR for foreign-denominated taxes). Non-compliance with "
        "tech deployment, planning disclosure, or dealing with unregistered vendors can attract fines of up to ₦5 million.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Tax authorities may revoke petroleum or mining licences for persistent non-payment of royalties or tax obligations.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Taxpayer Protections
    elements.append(Paragraph("<b>Taxpayer Protections and Transparency</b>", styles['Heading2']))
    elements.append(Paragraph("The Act balances enforcement with fairness. It introduces:", styles['Justify']))
    elements.append(Spacer(1, 8))

    protections = [
        "Advance tax rulings, offering clarity to businesses on complex or uncertain transactions;",
        "Tax clearance certificates as a precondition for public procurement or licensing;",
        "Amicable dispute resolution procedures, allowing for negotiated settlements in appropriate cases."
    ]
    for protection in protections:
        elements.append(Paragraph(f"• {protection}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "Taxpayer data is protected under strict confidentiality rules, and all persons involved in tax administration are subject to secrecy "
        "obligations. The Act also reaffirms the legal admissibility of electronically maintained records, marking a decisive shift toward e-governance.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Nigeria Revenue Service Act
    elements.append(Paragraph("<b>NIGERIA REVENUE SERVICE (ESTABLISHMENT) ACT, 2025</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Nigeria Revenue Service (Establishment) Act, 2025 marks a significant institutional reform of Nigeria's federal tax administration. "
        "It repeals the Federal Inland Revenue Service (Establishment) Act, 2007, and formally establishes the Nigeria Revenue Service (NRS) as "
        "the central authority for the assessment, collection, accounting, and enforcement of federally collectible taxes and other designated revenues.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The law reflects an evolution in both the structure and scope of tax administration at the federal level. Unlike its predecessor, the NRS "
        "is now empowered to operate within a broader institutional framework that encompasses both tax and select non-tax revenues such as petroleum "
        "royalties and statutory levies as well as data integration and inter-agency collaboration.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Mandate
    elements.append(Paragraph("<b>Mandate and Powers</b>", styles['Heading2']))
    elements.append(Paragraph("The Act mandates the NRS to:", styles['Justify']))
    elements.append(Spacer(1, 8))

    nrs_mandate = [
        "Administer and enforce all federal tax laws and collect revenues accruing to the Federation;",
        "Assess and account for taxes, levies, and charges imposed by federal legislation;",
        "Enforce compliance, including powers to trace, freeze, seize, or confiscate proceeds of tax fraud or evasion;",
        "Collaborate with other national and international bodies for the exchange of tax information;",
        "Maintain a centralised taxpayer database and issue Taxpayer Identification Numbers (TINs) in collaboration with state tax authorities and the Joint Revenue Board."
    ]
    for mandate in nrs_mandate:
        elements.append(Paragraph(f"• {mandate}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "The NRS is also empowered to assist subnational governments (State, FCT, and Local Government) in tax administration, when requested or "
        "where inter-agency collaboration is required by law.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Structure
    elements.append(Paragraph("<b>Institutional Structure and Governance</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The NRS is structured as an autonomous body corporate with perpetual succession. It is overseen by a Governing Board, chaired by the "
        "Executive Chairman, who also serves as the agency's chief executive and accounting officer. The Executive Chairman is appointed by the "
        "President and confirmed by the Senate. The Board includes representatives from Nigeria's six geopolitical zones and relevant federal agencies "
        "and ministries, ensuring national balance and inter-ministerial coordination.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("Among other responsibilities, the Board is tasked with:", styles['Justify']))
    elements.append(Spacer(1, 8))

    board_tasks = [
        "Approving strategic plans and performance frameworks;",
        "Overseeing financial and operational policies;",
        "Employing and managing staff, and setting remuneration;",
        "Monitoring tax policy implementation and recommending reforms where needed."
    ]
    for task in board_tasks:
        elements.append(Paragraph(f"• {task}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 16))

    # Funding
    elements.append(Paragraph("<b>Operational Funding and Enforcement</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The NRS is authorised to fund its operations through a 4% cost-of-collection allocation from non-petroleum tax revenues (i.e., excluding "
        "petroleum royalties). It may also receive grants, gifts, and returns from investments, subject to appropriate approvals.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Importantly, the Act introduces stronger financial enforcement mechanisms: where a government Ministry, Department or Agency (MDA) fails to "
        "remit collected revenues, the Accountant-General of the Federation is empowered to deduct such sums directly from their budgetary allocations "
        "and credit the appropriate revenue account.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NRS is exempt from income tax liability in the course of its operations, although it is still required to deduct and remit applicable "
        "PAYE and withholding taxes from staff and suppliers.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Conclusion
    elements.append(Paragraph("<b>CONCLUSION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Together, the 2025 tax reform laws signal a bold step toward building a more coherent, accountable, and investor-friendly tax environment. "
        "However, as with all structural reforms, the real test lies in implementation. Effective collaboration among all tiers of government, transparent "
        "administration, robust institutional capacity, and public trust will be essential to unlock the full benefits of these reforms.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The Ernest Shonekan Centre for Legislative Reforms and Economic Development will continue to monitor, support, and engage stakeholders to ensure "
        "that these laws translate into a measurable impact for citizens, businesses, and the Nigerian economy at large.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ Tax Reform Laws Overview PDF created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_pdf()
