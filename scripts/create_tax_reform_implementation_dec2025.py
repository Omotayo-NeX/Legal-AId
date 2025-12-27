#!/usr/bin/env python3
"""
Create PDF for Nigeria Tax Reform Acts 2025 Implementation Update (December 2025).
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "nigeria_tax_reform_implementation_dec2025.pdf"

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
    title = Paragraph("<b>NIGERIA TAX REFORM ACTS 2025<br/>IMPLEMENTATION UPDATE - DECEMBER 2025</b>", styles['Center'])
    elements.append(title)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph(
        "This document provides the latest update on the implementation status of Nigeria's landmark tax reform legislation "
        "as of December 27, 2025. It consolidates official government statements, press releases, and clarifications issued "
        "in the final days leading to the January 1, 2026 implementation deadline.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The four Acts collectively known as the Tax Reform Bills include: the Nigeria Tax Act, 2025; the Nigeria Tax Administration Act, 2025; "
        "the Nigeria Revenue Service (Establishment) Act, 2025; and the Joint Revenue Board (Establishment) Act, 2025.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Presidential Signing
    elements.append(Paragraph("<b>PRESIDENTIAL ASSENT AND OFFICIAL GAZETTE</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "On June 26, 2025, President Bola Ahmed Tinubu signed into law all four tax reform bills, marking the most comprehensive "
        "overhaul of Nigeria's fiscal architecture in decades. The bills were passed by the National Assembly earlier in June 2025 "
        "after months of deliberation and stakeholder engagement.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The laws were subsequently published in the Official Gazette as follows:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    gazette_list = [
        "Nigeria Tax Act, 2025 - Gazette No. 7",
        "Nigeria Tax Administration Act, 2025 - Gazette No. 5",
        "Nigeria Revenue Service (Establishment) Act, 2025 - Gazette No. 4",
        "Joint Revenue Board (Establishment) Act, 2025 - Gazette No. 6"
    ]
    for item in gazette_list:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "Two of the four laws took immediate effect upon assent: the Nigeria Revenue Service (Establishment) Act, 2025 and the "
        "Joint Revenue Board (Establishment) Act, 2025, both effective June 26, 2025. The remaining two laws—the Nigeria Tax Act "
        "and the Nigeria Tax Administration Act—are scheduled to commence on January 1, 2026.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # December 2025 Confirmation
    elements.append(Paragraph("<b>DECEMBER 2025: IMPLEMENTATION CONFIRMED</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>High-Level Presidential Meeting (December 26, 2025)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "On Friday, December 26, 2025, Taiwo Oyedele, Chairman of the Presidential Committee on Fiscal Policy and Tax Reforms, "
        "met with President Bola Ahmed Tinubu at his Lagos residence. Following the meeting, Oyedele confirmed that the Federal Government "
        "remains firmly committed to the January 1, 2026 implementation date for the Nigeria Tax Act and the Nigeria Tax Administration Act.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "In his statement to the press, Oyedele emphasized: 'There is no going back on the January 1, 2026 implementation date. "
        "The final implementation phase—specifically covering the Nigeria Tax Act and the Nigeria Tax Administration Act—is firmly on schedule.'",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "He dismissed calls for further delays, noting that the decision to proceed was driven by the pro-people nature of the reforms, "
        "which are designed to reduce the tax burden on ordinary Nigerians and stimulate economic growth.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Official Government Position</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Voice of Nigeria Broadcasting Service and the Federal Ministry of Information and National Orientation have both issued "
        "official statements affirming January 1, 2026 as the commencement date. The government has emphasized that despite ongoing "
        "controversy over alleged alterations in the gazetted versions of the laws, implementation will proceed as planned.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The National Assembly directed its Clerk to re-gazette the tax laws and issue Certified True Copies of the versions actually "
        "passed by both chambers. However, this administrative process has not affected the scheduled implementation timeline.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Key Benefits
    elements.append(Paragraph("<b>KEY BENEFITS AND IMPACT ON NIGERIANS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Relief for Workers and Low-Income Earners</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The reforms promise significant economic relief for the vast majority of Nigerian workers. According to official statements "
        "from the Presidential Committee:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    benefits_workers = [
        "Approximately 98% of Nigerian workers will either pay no PAYE (Pay As You Earn) tax or see their tax liability reduced.",
        "Individuals earning ₦800,000 or less annually will be fully exempt from personal income tax.",
        "The introduction of a 20% rent deduction (capped at ₦500,000) will ease the housing cost burden for employees and low-income earners.",
        "Progressive tax rates ranging from 0% to 25% will ensure equitable burden-sharing across income levels."
    ]
    for benefit in benefits_workers:
        elements.append(Paragraph(f"• {benefit}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Support for Small Businesses</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Small and medium-sized enterprises (SMEs), which form the backbone of Nigeria's economy, will receive unprecedented support:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    benefits_sme = [
        "97% of small businesses will be completely exempt from Corporate Income Tax (CIT), Value Added Tax (VAT), and Withholding Tax (WHT).",
        "Companies with annual turnover of ₦50 million or less will pay 0% companies income tax.",
        "Larger companies will also see reductions in their overall tax burden due to the consolidation of multiple sectoral levies into a single 4% Development Levy.",
        "Input VAT recovery has been expanded, particularly for capital expenditure and input services, reducing cascading tax burdens on businesses."
    ]
    for benefit in benefits_sme:
        elements.append(Paragraph(f"• {benefit}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Modernization and Simplification</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The reforms consolidate over a dozen outdated tax statutes into unified legislation, including:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    consolidated_acts = [
        "Companies Income Tax Act (CITA)",
        "Personal Income Tax Act (PITA)",
        "Capital Gains Tax Act (CGTA)",
        "Value Added Tax Act",
        "Stamp Duties Act",
        "Petroleum Profits Tax Act",
        "Education Tax Act",
        "Information Technology Development Levy Act",
        "National Agency for Science and Engineering Infrastructure (NASENI) Levy Act"
    ]
    for act in consolidated_acts:
        elements.append(Paragraph(f"• {act}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "This consolidation is expected to reduce fragmentation, promote consistency, enhance the ease of doing business, "
        "reduce taxpayer compliance burdens, and create a more predictable fiscal environment.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Recent Developments
    elements.append(Paragraph("<b>RECENT DEVELOPMENTS AND CLARIFICATIONS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>FIRS Stakeholder Engagement (November 2025)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "On November 10, 2025, the Federal Inland Revenue Service (now rebranded as Nigeria Revenue Service) held a high-level Strategic "
        "Stakeholder Engagement Session at the Congress Hall, Transcorp Hilton Hotel, Abuja. The session was designed to officially unveil "
        "the Nigeria Tax Reform Acts and engage key stakeholders on implementation strategies.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "During the event, FIRS officials presented detailed guidance on compliance requirements, taxpayer registration procedures, and the "
        "technological infrastructure being deployed to support the new tax regime. Participants included representatives from professional "
        "bodies (ICAN, CITN), business associations (MAN, NACCIMA, LCCI), civil society organizations, and state revenue services.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Revenue Mobilisation and Fiscal Commission Workshop</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Revenue Mobilisation Allocation and Fiscal Commission (RMAFC) convened a National Stakeholders' Discourse to drive effective "
        "implementation of the Nigeria Tax Act 2025. The discourse focused on intergovernmental coordination, revenue sharing formulas, and "
        "capacity building for subnational tax authorities.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Commission members and stakeholders expressed broad support for the reforms, while emphasizing the need for robust public education "
        "campaigns to counter misinformation and build taxpayer confidence.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Opposition from Nigeria Labour Congress (December 25, 2025)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "On December 25, 2025, the Nigeria Labour Congress (NLC) issued a statement calling on Nigerians to reject what it described as "
        "'distorted or falsified tax law.' NLC President Joe Ajaero stated that distortions and alleged forgery associated with certain tax "
        "policies undermine credibility and public trust.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NLC's concerns centered on alleged discrepancies between the bills passed by the National Assembly and the versions published in "
        "the Official Gazette. In response, Taiwo Oyedele dismissed these claims as baseless, affirming that the gazetted laws are authentic and "
        "that circulating 'alternative versions' are fake.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Main Challenge: Misinformation</b>", styles['Heading2']))
    elements.append(Paragraph(
        "In multiple media appearances throughout December 2025, Taiwo Oyedele identified misinformation as the biggest challenge facing the tax "
        "reform implementation. He noted that even before alleged alteration issues arose, there had been calls for suspension based on unfounded fears.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Common misconceptions addressed by the Presidential Committee include:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    misconceptions = [
        "False claims that the reforms will increase tax burdens on ordinary Nigerians (in reality, 98% of workers will pay less or no tax).",
        "Misinformation about bank account blocking for those without TIN (existing accounts will not be blocked; see separate guidance document).",
        "Unfounded fears that VAT rates will be increased (VAT remains at 7.5% with expanded zero-rated items).",
        "Claims that small businesses will be heavily taxed (97% of SMEs will be exempt from major taxes)."
    ]
    for item in misconceptions:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Institutional Changes
    elements.append(Paragraph("<b>INSTITUTIONAL TRANSFORMATION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>FIRS Rebranded as Nigeria Revenue Service (NRS)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Nigeria Revenue Service (Establishment) Act, 2025 has formally transitioned the Federal Inland Revenue Service (FIRS) into the "
        "Nigeria Revenue Service (NRS). This transformation went into effect on June 26, 2025.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NRS has been granted greater operational autonomy and its mandate has been expanded to include non-tax revenue collection, such as:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))

    nrs_mandate = [
        "Petroleum royalties",
        "Statutory levies and fees",
        "Revenue from government-owned enterprises (as designated)",
        "Any other federally collectible revenue as may be prescribed by law"
    ]
    for mandate in nrs_mandate:
        elements.append(Paragraph(f"• {mandate}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph(
        "The NRS is now positioned as a comprehensive revenue mobilization agency, moving beyond its traditional role as a tax collector to become "
        "a strategic partner in national fiscal management.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("<b>Revenue Performance Under New Framework</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Despite the transition and preparation for the new tax regime, the NRS (formerly FIRS) reported strong revenue performance in 2025. "
        "As of December 2025, total federal revenue collection stood at ₦22.59 trillion, representing a significant increase over the previous year.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "This performance has been attributed to improved compliance, enhanced digital infrastructure, and proactive enforcement measures. The NRS "
        "expects revenue performance to improve further in 2026 as the full benefits of the tax reforms take effect.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Timeline Summary
    elements.append(Paragraph("<b>IMPLEMENTATION TIMELINE SUMMARY</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    timeline_items = [
        "<b>June 2025:</b> National Assembly passes the four tax reform bills after extensive deliberation.",
        "<b>June 26, 2025:</b> President Bola Ahmed Tinubu signs all four bills into law. Two Acts (NRS Establishment Act and JRB Establishment Act) take immediate effect.",
        "<b>September 2025:</b> Official Gazettes published for all four Acts.",
        "<b>November 10, 2025:</b> NRS holds Strategic Stakeholder Engagement Session in Abuja to unveil the reforms.",
        "<b>December 22-26, 2025:</b> Final clarifications issued on TIN requirements, VAT implementation, and other key provisions.",
        "<b>December 26, 2025:</b> Presidential Committee Chairman meets President Tinubu; implementation for January 1, 2026 confirmed.",
        "<b>January 1, 2026:</b> Nigeria Tax Act, 2025 and Nigeria Tax Administration Act, 2025 take effect nationwide."
    ]
    for timeline in timeline_items:
        elements.append(Paragraph(f"• {timeline}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 24))

    # Conclusion
    elements.append(Paragraph("<b>CONCLUSION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "As of December 27, 2025, Nigeria stands at the threshold of a historic fiscal transformation. The tax reform laws represent the most "
        "comprehensive overhaul of the country's tax system in over three decades, with the potential to significantly reshape revenue mobilization, "
        "improve taxpayer experience, and support inclusive economic growth.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "While controversy and misinformation have clouded public discourse in recent weeks, the Federal Government has remained steadfast in its "
        "commitment to the January 1, 2026 implementation date. The success of these reforms will ultimately depend on effective intergovernmental "
        "coordination, transparent administration, robust institutional capacity, and sustained public engagement.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Taxpayers, businesses, and tax practitioners are advised to familiarize themselves with the new provisions, seek professional guidance where "
        "necessary, and engage with the NRS and state revenue services to ensure smooth transition and compliance.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ Tax Reform Implementation Update PDF created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_pdf()
