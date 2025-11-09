#!/usr/bin/env python3
"""
Create a sample PDF document for demonstration.
This simulates the Nigerian Tax Reform Acts content.
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "nigeria_tax_reform_act_2025_sample.pdf"

def create_sample_pdf():
    """Create a sample PDF with realistic tax content."""

    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18,
    )

    # Container for the 'Flowable' objects
    elements = []

    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER, fontSize=14, spaceAfter=30))

    # Title
    title = Paragraph("<b>NIGERIA TAX REFORM ACT 2025</b>", styles['Center'])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # Commencement
    elements.append(Paragraph("<b>PART I - PRELIMINARY</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 1. Commencement</b>", styles['Heading2']))
    elements.append(Paragraph(
        "This Act shall commence on 1st January 2026 and shall apply to all taxable income "
        "derived on or after the commencement date. The provisions of this Act supersede all "
        "previous tax legislation including the Companies Income Tax Act (CITA) and the "
        "Personal Income Tax Act (PITA).",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    # Definitions
    elements.append(Paragraph("<b>Section 2. Interpretation</b>", styles['Heading2']))
    elements.append(Paragraph(
        'In this Act, unless the context otherwise requires:<br/>'
        '<br/>'
        '"taxable income" means the gross income of a person for a year of assessment after '
        'deducting all allowable expenses and reliefs as provided under this Act;<br/>'
        '<br/>'
        '"company" means a body corporate established under the laws of Nigeria or any other '
        'jurisdiction, including corporations, partnerships, and limited liability companies;<br/>'
        '<br/>'
        '"individual" means a natural person who is resident in Nigeria or derives income from '
        'Nigeria, subject to personal income taxation under this Act;<br/>'
        '<br/>'
        '"digital asset" means any digital representation of value or contractual rights that can '
        'be transferred, stored, or traded electronically, including but not limited to '
        'cryptocurrencies, virtual currencies, non-fungible tokens (NFTs), and other blockchain-based assets;<br/>'
        '<br/>'
        '"virtual asset" has the same meaning as digital asset;',
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part II
    elements.append(Paragraph("<b>PART II - TAXABLE INCOME</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 3. Taxable Income for Companies</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The taxable income of a company for a year of assessment shall consist of:<br/>"
        "(a) profits from trade, business, profession, or vocation;<br/>"
        "(b) gains from the disposal of assets;<br/>"
        "(c) dividends, interests, royalties, and rents;<br/>"
        "(d) income from digital assets and virtual assets;<br/>"
        "(e) any other income derived from sources within or outside Nigeria.<br/><br/>"
        "For the purposes of computing taxable income, a company may deduct all expenses "
        "wholly, exclusively, and necessarily incurred in the production of income, including "
        "depreciation allowances, pension contributions, and bad debts written off.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 4. Taxable Income for Individuals</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The taxable income of an individual for a year of assessment shall include:<br/>"
        "(a) emoluments from employment including salaries, wages, bonuses, and allowances;<br/>"
        "(b) income from business or professional practice;<br/>"
        "(c) gains from the disposal of assets;<br/>"
        "(d) investment income including dividends, interests, and rents;<br/>"
        "(e) income from digital and virtual assets;<br/>"
        "(f) any other income from sources within or outside Nigeria.<br/><br/>"
        "An individual shall be entitled to deductions including consolidated relief allowance "
        "calculated as 1% of gross income or ₦200,000 (whichever is higher) plus 20% of gross income.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part III
    elements.append(Paragraph("<b>PART III - DIGITAL AND VIRTUAL ASSETS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 5. Taxation of Digital Assets</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Digital assets and virtual assets are covered under this Act and shall be subject to "
        "taxation as follows:<br/>"
        "(a) gains from the disposal of digital assets shall be treated as capital gains and taxed "
        "at the applicable capital gains tax rate of 10%;<br/>"
        "(b) income derived from mining, staking, or validating blockchain transactions shall be "
        "treated as business income;<br/>"
        "(c) digital assets received as payment for goods or services shall be valued at fair "
        "market value at the time of receipt.<br/><br/>"
        "Provided that the Nigeria Revenue Service may issue guidelines for the valuation and "
        "reporting of digital asset transactions.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part IV
    elements.append(Paragraph("<b>PART IV - ADMINISTRATION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 6. Nigeria Revenue Service</b>", styles['Heading2']))
    elements.append(Paragraph(
        "The Federal Inland Revenue Service (FIRS) is hereby replaced by the Nigeria Revenue Service "
        "(NRS) which shall be the primary tax authority responsible for the administration and "
        "collection of taxes under this Act. The NRS shall:<br/>"
        "(a) assess, collect, and account for all federal taxes;<br/>"
        "(b) enforce compliance with tax laws;<br/>"
        "(c) maintain a central tax database;<br/>"
        "(d) coordinate with state revenue services.<br/><br/>"
        "The NRS shall operate under the supervision of the Joint Revenue Board established under "
        "the Joint Revenue Board Establishment Act 2024.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part V
    elements.append(Paragraph("<b>PART V - DIVIDENDS AND DISTRIBUTIONS</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 7. Treatment of Dividends</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Dividends paid by a company shall be subject to withholding tax at the rate of 10%. "
        "However, dividends paid out of profits that have not been subjected to tax (untaxed profits) "
        "shall be treated as follows:<br/>"
        "(a) the company shall first pay corporation tax on such profits at the prevailing rate of 30%;<br/>"
        "(b) after payment of corporation tax, the dividend withholding tax of 10% shall apply to "
        "the net amount distributed;<br/>"
        "(c) the recipient of such dividends shall be entitled to a tax credit for the corporation "
        "tax paid by the company.<br/><br/>"
        "Dividends paid from previously taxed profits shall only be subject to the 10% withholding "
        "tax without further corporation tax liability.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part VI
    elements.append(Paragraph("<b>PART VI - VALUE ADDED TAX</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 8. VAT Rate and Application</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Value Added Tax (VAT) shall be charged at the rate of 7.5% on the supply of all goods "
        "and services in Nigeria, except those specifically exempted under Schedule 2 of this Act.<br/><br/>"
        "The following persons shall register for VAT and charge VAT on their supplies:<br/>"
        "(a) any person whose annual turnover exceeds ₦25,000,000;<br/>"
        "(b) any person who imports goods or services into Nigeria;<br/>"
        "(c) any person who makes taxable supplies regardless of turnover, at their option.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 9. VAT Registration for Freelancers</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Freelancers and independent contractors need to charge VAT under the 2026 Nigerian tax law "
        "if they meet the following conditions:<br/>"
        "(a) their annual turnover from freelance services exceeds ₦25,000,000;<br/>"
        "(b) they provide services that are not exempt under Schedule 2;<br/>"
        "(c) they invoice clients registered in Nigeria.<br/><br/>"
        "Freelancers with turnover below ₦25,000,000 are not required to register for VAT unless "
        "they voluntarily choose to do so. Provided that freelancers providing exempt services "
        "(such as medical, educational, or charitable services) are not required to charge VAT "
        "regardless of turnover.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(PageBreak())

    # Part VII
    elements.append(Paragraph("<b>PART VII - TAX RATES</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 10. Corporation Tax Rate</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Corporation tax shall be charged at the rate of 30% on the taxable income of companies. "
        "Provided that small companies with turnover not exceeding ₦25,000,000 shall pay tax at "
        "the rate of 20% on their taxable income.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Section 11. Personal Income Tax Rates</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Personal income tax shall be charged at the following graduated rates:<br/>"
        "(a) first ₦300,000 of taxable income: 7%<br/>"
        "(b) next ₦300,000: 11%<br/>"
        "(c) next ₦500,000: 15%<br/>"
        "(d) next ₦500,000: 19%<br/>"
        "(e) next ₦1,600,000: 21%<br/>"
        "(f) above ₦3,200,000: 24%",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    # Build PDF
    doc.build(elements)
    print(f"✅ Sample PDF created: {OUTPUT_FILE}")
    print(f"   Size: {OUTPUT_FILE.stat().st_size / 1024:.2f} KB")

if __name__ == "__main__":
    try:
        from reportlab.lib.pagesizes import letter, A4
        create_sample_pdf()
    except ImportError:
        print("❌ Error: reportlab not installed")
        print("Run: pip install reportlab")
        import sys
        sys.exit(1)
