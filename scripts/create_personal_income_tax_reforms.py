#!/usr/bin/env python3
"""
Create PDF for Personal Income Tax Reforms article.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "personal_income_tax_reforms_2025.pdf"

def create_pdf():
    """Create Personal Income Tax Reforms PDF."""

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
    title = Paragraph("<b>REFORMS OF THE PERSONAL INCOME TAX REGIME BRING IMPORTANT CHANGES</b>", styles['Center'])
    subtitle = Paragraph("<i>Nigeria Tax Act, 2025</i>", styles['Center'])
    elements.append(title)
    elements.append(subtitle)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph(
        "The president of Nigeria signed into law the Nigeria Tax Act, 2025 (NTA) on 26 June 2025. "
        "The NTA repeals certain existing tax laws, including the Personal Income Tax Act (PITA) and "
        "consolidates them into a single, unified legislation. It also introduces key reforms to Nigeria's "
        "personal income tax regime, providing clearer rules on how income is determined, how individuals "
        "are assessed, taxed, and expected to comply.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "<b>The NTA will become effective from January 2026.</b>",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Why This Matters
    elements.append(Paragraph("<b>WHY THIS MATTERS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Key changes in the NTA for individuals and employers include a new definition of tax resident and "
        "non-resident, changes to personal reliefs, revision of tax rates and the respective income bands, "
        "among others. The key changes, while aimed at reducing the tax burden of low-income earners, could "
        "also result in higher taxes for higher-income earners, which may include individuals on international "
        "assignments.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The revised residence rules under the NTA could mean that assignees in Nigeria qualify as tax residents "
        "where it is deemed they have a permanent home in the country for the purpose of their assignment. This "
        "would result in their worldwide income being taxable in Nigeria rather than just their Nigerian-sourced "
        "income. In addition, the increased tax rates, revised income bands, and the removal of the Consolidated "
        "Relief Allowance (as discussed below) will raise the effective tax rate for employees (from about 18 "
        "percent to 25 percent), creating higher costs for employers in respect of tax-equalised employees.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Furthermore, trailing income linked to Nigerian employment is now expressly taxable even after an "
        "individual's exit – in this regard, both employers and employees need to review processes to foster "
        "accurate tracking and compliance.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Once the NTA becomes effective, the changes affecting individuals may impact international assignment "
        "cost projections, hypothetical tax calculations, and payroll withholding processes. Accordingly, employers "
        "would need to re-assess their assignment cost projections, adjust payroll systems, and consider updating "
        "their tax planning strategy where assignments to and from Nigeria are concerned.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Context
    elements.append(Paragraph("<b>CONTEXT</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NTA represents one of the most significant tax reforms in Nigeria in over a decade. This reform is "
        "aimed at enhancing revenue generation, simplifying compliance procedures, and addressing regional "
        "disparities in tax administration. Three complementary pieces of legislation: Nigerian Tax Administration "
        "Act, the Nigerian Revenue Service Act, and the Joint Revenue Board Establishment Act were also enacted "
        "to streamline tax administration in Nigeria.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The last major reform to Nigeria's personal income tax regime was in 2011 (effective from 2012), with "
        "minor adjustments introduced through the Finance Acts between 2019 and 2023. Prior to now, neither the "
        "tax rates nor many of the rules governing individual taxation have been revised.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Key Highlights
    elements.append(Paragraph("<b>KEY HIGHLIGHTS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    # Definition of Resident
    elements.append(Paragraph("<b>Definition of Resident and Non-Resident Individual</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Under the current law, there is no clear definition of a resident or non-resident person. However, the "
        "NTA has now introduced clear definitions of a resident individual to include a person who in any year:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 6))

    resident_criteria = [
        "is domiciled in Nigeria;",
        "has a permanent place for his domestic use;",
        "has substantial economic and immediate family ties in Nigeria; or",
        "sojourns in Nigeria for a period up to or more than 183 days in a 12-month period, inclusive of annual leave or temporary absence."
    ]
    for item in resident_criteria:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "A non-resident individual is defined as a person who does not satisfy any of the conditions mentioned above.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Worldwide Income
    elements.append(Paragraph("<b>Residents Taxable on Worldwide Income</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Although this is not a new rule, the NTA has introduced explicit provisions confirming that Nigerian "
        "residents are taxable on their worldwide income regardless of where it arises or whether it is brought "
        "into Nigeria. In contrast, non-resident individuals are taxable on only Nigeria-sourced income.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "Individuals on international assignment who qualify as Nigerian tax resident would be taxable on their "
        "worldwide income.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Employment Income
    elements.append(Paragraph("<b>Tax Rules for Employment Income in Nigeria</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Under the NTA, employment income remains taxable in Nigeria where the employee is a Nigerian tax resident "
        "or his duties of employment are partly or wholly performed in Nigeria, subject to certain conditions. "
        "However, these revised rules do not appear to capture employment income earned by remote workers who "
        "perform all the duties of their employment outside of Nigeria.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Tech Employees
    elements.append(Paragraph("<b>Tax Exemption for Non-Resident Tech Employees</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Employment income of non-resident employees of start-ups or companies engaged in technology-driven "
        "services or creative arts are exempted from income tax provided their employment income is taxable in "
        "their country of tax residence.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Tax Rates Table
    elements.append(Paragraph("<b>Revised Income Bands and Tax Rates</b>", styles['Heading2']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NTA introduces a more progressive personal income tax regime which features revised income tax rates "
        "and income bands for individuals. See the table below. In addition, the personal income tax and capital "
        "gains tax regimes have been merged, meaning that capital gains are now subject to the applicable income "
        "tax rates below, and the former flat 10-percent Capital Gains Tax (CGT) rate will no longer apply.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    # Create tax rate table
    table_data = [
        ['S/N', 'Income Bands', 'Rate'],
        ['1', '₦0 – ₦800,000', '0%'],
        ['2', '₦800,001 – ₦3,000,000', '15%'],
        ['3', '₦3,000,001 – ₦12,000,000', '18%'],
        ['4', '₦12,000,001 – ₦25,000,000', '21%'],
        ['5', '₦25,000,001 – ₦50,000,000', '23%'],
        ['6', 'Over ₦50,000,000', '25%'],
    ]

    table = Table(table_data, colWidths=[60, 250, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 8))
    elements.append(Paragraph("<i>Source: KPMG in Nigeria</i>", styles['BodyText']))
    elements.append(Spacer(1, 24))

    # Rent Allowance
    elements.append(Paragraph("<b>Rent Allowance to Replace Consolidated Relief Allowance (CRA)</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The NTA eliminates the Consolidated Relief Allowance (CRA) and introduces the rent relief of 20 percent "
        "of annual rent paid, capped at ₦500,000. To claim this relief, individuals will be required to declare "
        "their annual rent and provide supporting information as may be required by the relevant tax authorities. "
        "Homeowners and others who do not pay rent are not eligible, leaving their only personal relief limited to "
        "the first ₦800,000 of income under the revised tax bands.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "Further implementation guidelines are expected from the tax authorities.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 16))

    # Trailing Income
    elements.append(Paragraph("<b>Taxation of Trailing Income</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The NTA clarifies the timing of income recognition for one-off or deferred payments such as bonuses, "
        "commissions, allowances, or terminal benefits. Unlike regular salary, which accrues day-to-day, these "
        "payments are deemed taxable on the actual date of payment or, if made after cessation of employment, on "
        "the last day of the employment. These provisions provide clearer rules for the taxation of income that "
        "arises after or outside normal employment periods.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # KPMG Insights
    elements.append(Paragraph("<b>KPMG INSIGHTS - STEPS TO CONSIDER</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "In preparation for the implementation date of January 2026, individuals and employers may wish to "
        "consider the following:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    steps = [
        "<b>Process updates by employers:</b> Employers and their service providers may wish to update payroll "
        "systems, processes, and compliance tools to reflect the revised income bands, tax rates, and personal "
        "relief framework under the NTA.",

        "<b>Assessing personal impact:</b> Individual taxpayers – this includes international assignees subject to "
        "Nigerian tax law – may wish to consider how the NTA would impact their finances, explore tax planning "
        "opportunities, and seek guidance from professionals to fully understand and prepare for the implementation "
        "of the NTA.",

        "<b>Educate staff and stakeholders:</b> Employers may wish to educate staff and other stakeholders about the "
        "impending changes to employees on international assignments to foster proper planning."
    ]

    for step in steps:
        elements.append(Paragraph(f"• {step}", styles['BodyText']))
        elements.append(Spacer(1, 10))

    elements.append(Spacer(1, 16))

    # What's Next
    elements.append(Paragraph("<b>WHAT'S NEXT</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The NTA is not yet in force. Given the scale of the reforms, the government has deliberately provided a "
        "transition period of over three months to allow stakeholders sufficient time to prepare for adoption ahead "
        "of the implementation date, with the aim of minimising potential disruptions.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Further guidelines are expected from the tax authorities ahead of the 1 January 2026 implementation date.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "If companies, their assignees, and/or their programme managers have any questions or concerns about the "
        "NTA, its application and potential impacts, and appropriate next steps, they should consult with their "
        "qualified tax professional or a member of the GMS tax team with KPMG in Nigeria.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ Personal Income Tax Reforms PDF created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_pdf()
