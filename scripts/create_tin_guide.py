#!/usr/bin/env python3
"""
Create a PDF document for Tax Identification Number (TIN) guide.
This provides comprehensive information about TINs for Nigerian businesses.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable, ListItem
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = OUTPUT_DIR / "tax_identification_number_tin_guide.pdf"

def create_tin_guide():
    """Create TIN guide PDF."""

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
    title = Paragraph("<b>TAX IDENTIFICATION NUMBER (TIN) FOR NIGERIAN BUSINESSES</b>", styles['Center'])
    subtitle = Paragraph("<i>A Comprehensive Guide</i>", styles['Center'])
    elements.append(title)
    elements.append(subtitle)
    elements.append(Spacer(1, 24))

    # Introduction
    elements.append(Paragraph("<b>INTRODUCTION</b>", styles['Heading1']))
    elements.append(Paragraph(
        "A Tax Identification Number (TIN) is one of the most essential requirements for businesses in Nigeria. "
        "Whether you're registering a sole proprietorship or a Limited Liability Company (LTD), having a TIN ensures "
        "your business complies with tax regulations while opening doors to critical opportunities like loans, government "
        "contracts, and grants.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "This guide provides everything you need to know about TINs in Nigeria: what they are, why they matter, "
        "how to get one, and how they can benefit your business.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 1: What is a TIN
    elements.append(Paragraph("<b>SECTION 1: WHAT IS A TAX IDENTIFICATION NUMBER (TIN)?</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "A Tax Identification Number (TIN) is a unique identifier issued by the Federal Inland Revenue Service (FIRS) "
        "to businesses and individuals for tax purposes. It is essential for filing taxes, opening corporate accounts, "
        "and ensuring compliance with Nigerian tax laws.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The TIN serves as your business's permanent tax identity and is required for all tax-related transactions "
        "with federal and state tax authorities.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 2: Why Your Business Needs a TIN
    elements.append(Paragraph("<b>SECTION 2: WHY DOES YOUR BUSINESS NEED A TIN?</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>2.1 Legal Compliance</b>", styles['Heading2']))
    elements.append(Paragraph(
        "All businesses in Nigeria are required by law to have a TIN for tax registration. Without it, your business "
        "may face penalties and challenges with regulatory authorities. The Companies Income Tax Act (CITA) and other "
        "tax legislation mandate that every registered business must obtain and use a TIN for all tax purposes.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>2.2 Access to Financial Services</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Banks require a TIN to open a corporate account. It's also necessary for applying for business loans or "
        "participating in government funding programs. Financial institutions use your TIN to verify your business's "
        "tax compliance status before extending credit or other financial services.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>2.3 Tax Filing</b>", styles['Heading2']))
    elements.append(Paragraph(
        "A TIN is mandatory for filing Value Added Tax (VAT), Company Income Tax, and other statutory returns. "
        "Your TIN must be included on all tax returns, assessments, and correspondence with tax authorities.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>2.4 Credibility and Growth</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Registered businesses with TINs gain more trust from clients, investors, and potential partners. It's a mark "
        "of professionalism and commitment to compliance. Many large organizations and government agencies will only "
        "do business with companies that have valid TINs.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Section 3: How to Obtain a TIN
    elements.append(Paragraph("<b>SECTION 3: HOW TO OBTAIN A TIN IN NIGERIA</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Step 1: Register Your Business</b>", styles['Heading2']))
    elements.append(Paragraph(
        "To apply for a TIN, your business must first be registered with the Corporate Affairs Commission (CAC). "
        "Without this step, your application cannot proceed. You must have your CAC registration certificate and "
        "company registration number (RC number) before applying for a TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Step 2: Submit an Application to the FIRS</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Visit your local Federal Inland Revenue Service (FIRS) office to begin your TIN application. Some states "
        "also allow online submissions through the FIRS portal at www.firs.gov.ng. You can complete the TIN "
        "registration form online or download it and submit it in person at any FIRS office.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Step 3: Provide the Required Documents</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Ensure you have the following documents:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 6))

    # Create bullet list
    doc_list_items = [
        "Your CAC registration certificate",
        "Memorandum and Articles of Association (for companies)",
        "A valid means of identification (e.g., passport or national ID)",
        "Proof of business address (e.g., a utility bill or rent agreement)",
        "List of directors and shareholders with their personal information",
        "Copy of the company's operational license (if applicable)"
    ]

    for item in doc_list_items:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Step 4: Receive Your TIN</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Once your documents are verified, you'll receive your TIN certificate within a few days. The process is "
        "straightforward if all information is accurate. The TIN certificate will contain your unique TIN number, "
        "which you must use for all tax transactions.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 4: TIN Verification
    elements.append(Paragraph("<b>SECTION 4: HOW TO VERIFY OR LOOK UP AN EXISTING TIN</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "If you're unsure whether your business or another entity has a valid TIN, you can verify it using the TIN "
        "Verification System on the FIRS website at www.firs.gov.ng. Simply input the business name or registration "
        "number to retrieve the associated TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "This verification system is useful for:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 6))

    verification_uses = [
        "Confirming your own business's TIN status",
        "Checking the legitimacy of vendors and partners before entering contracts",
        "Verifying compliance status of business associates",
        "Ensuring TIN accuracy before submitting tax returns"
    ]

    for item in verification_uses:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Section 5: TIN and VAT Relationship
    elements.append(Paragraph("<b>SECTION 5: TIN AND VAT - UNDERSTANDING THE RELATIONSHIP</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "A TIN is your general tax identifier, but it also serves as the foundation for registering for Value Added "
        "Tax (VAT). Once you have a TIN, you must register separately for VAT if your business sells taxable goods "
        "or services.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Key Points About TIN and VAT:</b>", styles['Heading2']))
    elements.append(Spacer(1, 6))

    vat_points = [
        "Your TIN is required before you can register for VAT",
        "VAT registration is mandatory if your annual turnover exceeds ₦25 million",
        "The FIRS links your VAT obligations to your TIN",
        "VAT returns must be filed monthly using your TIN",
        "Failure to register for VAT when required can result in penalties and interest charges",
        "Your TIN remains the same, but you receive a separate VAT registration certificate"
    ]

    for item in vat_points:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "<b>In summary:</b> TIN is your tax ID. VAT registration is an additional step that's tied to your TIN and "
        "is required for businesses that meet the VAT threshold.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 6: Cost
    elements.append(Paragraph("<b>SECTION 6: HOW MUCH DOES IT COST TO GET A TIN?</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "The process of obtaining a TIN is <b>free of charge</b> in Nigeria. The Federal Inland Revenue Service (FIRS) "
        "does not charge any fees for TIN registration or issuance.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "However, if you hire a third party, agent, or consultant to assist you with the application process, they may "
        "charge a service fee. These fees vary depending on the service provider and typically range from ₦5,000 to "
        "₦50,000. It is advisable to apply directly through FIRS to avoid unnecessary expenses.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 7: Legal Consequences
    elements.append(Paragraph("<b>SECTION 7: LEGAL CONSEQUENCES OF OPERATING WITHOUT A TIN</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Running a business in Nigeria without a TIN can lead to serious legal and financial consequences:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    consequences = [
        "<b>Fines and penalties from the FIRS:</b> Tax authorities can impose substantial fines for non-compliance, "
        "which increase over time",
        "<b>Inability to open business bank accounts:</b> No commercial bank in Nigeria will open a corporate account "
        "without a valid TIN",
        "<b>Rejection of government contracts or grant applications:</b> All government procurement processes require "
        "TIN verification",
        "<b>Legal action for tax evasion:</b> Operating without a TIN can be prosecuted as tax evasion, which may "
        "result in criminal charges",
        "<b>Business closure:</b> In extreme cases, tax authorities can seek court orders to shut down non-compliant "
        "businesses",
        "<b>Inability to enforce contracts:</b> Courts may refuse to enforce commercial contracts if your business "
        "cannot demonstrate tax compliance"
    ]

    for item in consequences:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 8))

    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "<b>Important:</b> Having a TIN is not optional—it's a core part of operating a compliant business in Nigeria. "
        "The penalties for non-compliance far outweigh the simple effort required to obtain a TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    elements.append(PageBreak())

    # Section 8: Common Mistakes
    elements.append(Paragraph("<b>SECTION 8: COMMON MISTAKES TO AVOID WHEN GETTING A TIN</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Mistake 1: Skipping Business Registration</b>", styles['Heading2']))
    elements.append(Paragraph(
        "You cannot apply for a TIN without first registering your business with the CAC. Many entrepreneurs make the "
        "mistake of trying to get a TIN before completing CAC registration. Always register with CAC first, then "
        "proceed to FIRS for your TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Mistake 2: Providing Incomplete Information</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Missing or incorrect details in your application can lead to delays or rejection. Common errors include:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 6))

    info_errors = [
        "Incorrect business address or using a residential address when a commercial address is required",
        "Missing or expired identification documents",
        "Incomplete director/shareholder information",
        "Mismatched names between CAC registration and TIN application",
        "Wrong contact information (phone numbers, email addresses)"
    ]

    for item in info_errors:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Mistake 3: Neglecting Tax Compliance</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Having a TIN is only the first step. Many businesses obtain their TIN but then fail to file returns or pay "
        "taxes on time. This can result in:",
        styles['Justify']
    ))
    elements.append(Spacer(1, 6))

    compliance_issues = [
        "Accumulated penalties and interest charges",
        "Tax assessment by authorities",
        "Restriction of business operations",
        "Difficulty accessing credit facilities",
        "Potential criminal prosecution for persistent default"
    ]

    for item in compliance_issues:
        elements.append(Paragraph(f"• {item}", styles['BodyText']))
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Remember: Getting a TIN is just the beginning. Maintaining good standing requires regular tax filing and "
        "payment of all applicable taxes.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Section 9: FAQs
    elements.append(Paragraph("<b>SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQs)</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q1: Can individuals get a TIN?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Yes, individuals who earn taxable income, such as freelancers, contractors, or self-employed persons, can and "
        "should apply for a TIN. The process is similar to business TIN registration but requires personal identification "
        "and proof of income source.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q2: Is a TIN the same as a VAT number?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "No. A TIN is your general taxpayer identification number used for all tax purposes, while VAT registration is "
        "a specific process linked to your TIN for collecting and remitting Value Added Tax. You need a TIN before you "
        "can register for VAT.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q3: Can a business operate without a TIN?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "No. Operating without a TIN is illegal and puts your business at risk of fines, penalties, and legal action. "
        "It also disqualifies you from accessing many financial and legal benefits such as bank accounts, loans, and "
        "government contracts.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q4: How long does it take to get a TIN?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "If all your documents are complete and accurate, you can receive your TIN within 2-7 working days. Online "
        "applications through the FIRS portal may be processed faster than in-person submissions.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q5: What if I lose my TIN certificate?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "If you lose your TIN certificate, you can request a replacement from FIRS. Visit your local FIRS office with "
        "your business registration documents and identification. There may be a small administrative fee for issuing "
        "a replacement certificate.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<b>Q6: Do I need a separate TIN for each business I own?</b>", styles['Heading2']))
    elements.append(Paragraph(
        "Yes. Each separate business entity (company, partnership, etc.) requires its own TIN. However, if you're a "
        "sole proprietor operating multiple businesses under the same registration, you may use the same TIN.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 24))

    # Conclusion
    elements.append(Paragraph("<b>CONCLUSION</b>", styles['Heading1']))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "A Tax Identification Number (TIN) is an essential requirement for any business operating in Nigeria. It ensures "
        "legal compliance, provides access to financial services, and enhances your business's credibility. The process "
        "of obtaining a TIN is straightforward and free when done directly through FIRS.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "Remember that having a TIN is just the first step in tax compliance. You must also register for applicable "
        "taxes (such as VAT), file regular returns, and maintain accurate financial records. Failure to comply with "
        "these requirements can result in serious legal and financial consequences.",
        styles['Justify']
    ))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(
        "For more information about TINs and tax compliance in Nigeria, visit the Federal Inland Revenue Service "
        "website at www.firs.gov.ng or contact your local FIRS office.",
        styles['Justify']
    ))

    # Build PDF
    doc.build(elements)
    print(f"✓ TIN guide created: {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")

if __name__ == "__main__":
    create_tin_guide()
