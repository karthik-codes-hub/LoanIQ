import { jsPDF } from 'jspdf';
import { StoredApplication, AssessmentResult } from '../types';

/**
 * Cleanly sanitize text strings for standard PDF Helvetica font.
 * Replaces Unicode ₹ symbol with 'Rs. ' to prevent font glyph corruption.
 */
function sanitizeText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/₹/g, 'Rs. ')
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Map common unicode quotes or dashes to standard ASCII
      if (char === '’' || char === '‘') return "'";
      if (char === '“' || char === '”') return '"';
      if (char === '–' || char === '—') return '-';
      if (char === '•') return '*';
      if (char === '·') return '-';
      return ' ';
    });
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}

export function generateApplicationPDF(data: StoredApplication | AssessmentResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 182mm
  const bottomMargin = 20;

  // Determine outcome styling
  const isPositive = data.assessment_outcome === 'Eligible for further consideration';
  const isReview =
    data.assessment_outcome === 'Refer for human review' ||
    data.assessment_outcome === 'Additional information required';

  // Palette: Modern executive institutional theme
  const brandDark: [number, number, number] = [15, 23, 42]; // #0F172A Slate 900
  const brandNavy: [number, number, number] = [30, 41, 59]; // #1E293B Slate 800
  const brandBlue: [number, number, number] = [37, 99, 235]; // #2563EB Royal Blue
  const textDark: [number, number, number] = [15, 23, 42]; // #0F172A
  const textMuted: [number, number, number] = [100, 116, 139]; // #64748B Slate 500
  const textSubtle: [number, number, number] = [148, 163, 184]; // #94A3B8 Slate 400
  const borderLight: [number, number, number] = [226, 232, 240]; // #E2E8F0 Slate 200
  const fillCard: [number, number, number] = [248, 250, 252]; // #F8FAFC Slate 50
  const fillZebra: [number, number, number] = [241, 245, 249]; // #F1F5F9 Slate 100

  const statusColor: [number, number, number] = isPositive
    ? [16, 185, 129] // Emerald #10B981
    : isReview
    ? [217, 119, 6] // Amber #D97706
    : [225, 29, 72]; // Rose #E11D48

  const statusBg: [number, number, number] = isPositive
    ? [236, 253, 245] // Emerald 50
    : isReview
    ? [254, 243, 199] // Amber 50
    : [255, 241, 242]; // Rose 50

  const statusBadgeText: [number, number, number] = isPositive
    ? [6, 95, 70] // Emerald 800
    : isReview
    ? [146, 64, 14] // Amber 800
    : [159, 18, 57]; // Rose 800

  let yPos = 0;

  // Running header for subsequent pages
  function drawRunningHeader(): void {
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, pageWidth, 12, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('LoanIQ UNDERWRITING DOSSIER', marginLeft, 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(`Reference: ${data.application_id}  |  CONFIDENTIAL`, pageWidth - marginRight, 7.5, { align: 'right' });

    doc.setDrawColor(...brandBlue);
    doc.setLineWidth(0.6);
    doc.line(0, 12, pageWidth, 12);
  }

  // Check if we need a page break before rendering an element of height neededHeight
  function ensureSpace(neededHeight: number): void {
    if (yPos + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      drawRunningHeader();
      yPos = 20; // reset below running header
    }
  }

  // ================= PAGE 1: HEADER BANNER =================
  doc.setFillColor(...brandDark);
  doc.rect(0, 0, pageWidth, 34, 'F');

  // Decorative top accent stripe
  doc.setFillColor(...brandBlue);
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text('LoanIQ', marginLeft, 16);

  // Brand Pill Tag
  doc.setFillColor(...brandBlue);
  doc.roundedRect( marginLeft + 32, 11, 46, 5.5, 1.2, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CREDIT RISK INTELLIGENCE', marginLeft + 34, 14.8);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Autonomous Underwriting & Serviceability Assessment Report', marginLeft, 23);

  // Document Reference badge (top right)
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - marginRight - 62, 7.5, 62, 21, 2, 2, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - marginRight - 62, 7.5, 62, 21, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('DOSSIER REFERENCE', pageWidth - marginRight - 31, 12.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(data.application_id, pageWidth - marginRight - 31, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const formattedDate = new Date(data.submitted_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`ISSUED: ${formattedDate}`, pageWidth - marginRight - 31, 24.5, { align: 'center' });

  yPos = 39;

  // ================= PRIMARY VERDICT HERO CARD =================
  const heroCardHeight = 44;
  doc.setFillColor(...statusBg);
  doc.roundedRect(marginLeft, yPos, contentWidth, heroCardHeight, 3, 3, 'F');

  doc.setDrawColor(...statusColor);
  doc.setLineWidth(0.8);
  doc.roundedRect(marginLeft, yPos, contentWidth, heroCardHeight, 3, 3, 'S');

  // Left solid accent bar inside card
  doc.setFillColor(...statusColor);
  doc.roundedRect(marginLeft, yPos, 4, heroCardHeight, 2, 2, 'F');

  // Outcome status badge
  doc.setFillColor(...statusColor);
  doc.roundedRect(marginLeft + 9, yPos + 6, 28, 5.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(isPositive ? 'RECOMMENDED' : isReview ? 'NEEDS REVIEW' : 'HIGH RISK', marginLeft + 23, yPos + 10, {
    align: 'center',
  });

  // Outcome Main Headline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...statusBadgeText);
  const cleanOutcome = sanitizeText(data.assessment_outcome).toUpperCase();
  doc.text(cleanOutcome, marginLeft + 41, yPos + 10.5);

  // 4 Micro Metrics Inside the Hero Card
  const pillY = yPos + 16;
  const pillW = (contentWidth - 14) / 4;
  const pillH = 15;

  const quickPills = [
    {
      label: 'LOAN FACILITY',
      val: data.loan_type.toUpperCase(),
      sub: sanitizeText(data.input_data.loan_purpose || 'General'),
    },
    {
      label: 'RISK TIER',
      val: `${data.credit_risk_tier.toUpperCase()} RISK`,
      sub: isPositive ? 'Within Standard' : 'Requires Review',
    },
    {
      label: 'SERVICEABILITY SCORE',
      val: `${(data.calibrated_probability * 100).toFixed(1)}%`,
      sub: 'Calibrated Probability',
    },
    {
      label: 'DECISION ENGINE',
      val: 'ML HYBRID v2.4',
      sub: data.loan_product_support_status === 'fully_supported_ml' ? 'Fully Benchmarked' : 'Affordability Heuristic',
    },
  ];

  quickPills.forEach((p, idx) => {
    const pX = marginLeft + 7 + idx * pillW;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pX, pillY, pillW - 3, pillH, 1.5, 1.5, 'F');
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(pX, pillY, pillW - 3, pillH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...textMuted);
    doc.text(p.label, pX + 3.5, pillY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...brandDark);
    doc.text(p.val, pX + 3.5, pillY + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...textSubtle);
    const splitSub = doc.splitTextToSize(p.sub, pillW - 8);
    doc.text(splitSub[0] || '', pX + 3.5, pillY + 12.5);
  });

  // Score Bar on bottom of Hero Card
  const scoreBarY = yPos + 34;
  const scoreBarW = contentWidth - 14;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(marginLeft + 7, scoreBarY, scoreBarW, 3, 1, 1, 'F');

  // Fill up to calibrated score
  const scoreFillW = Math.max(2, Math.min(scoreBarW, scoreBarW * data.calibrated_probability));
  doc.setFillColor(...statusColor);
  doc.roundedRect(marginLeft + 7, scoreBarY, scoreFillW, 3, 1, 1, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...textMuted);
  doc.text('0% Higher Risk', marginLeft + 7, scoreBarY + 6.5);
  doc.text('Threshold (65%)', marginLeft + 7 + scoreBarW * 0.65, scoreBarY + 6.5, { align: 'center' });
  doc.text('100% Prime Serviceability', marginLeft + 7 + scoreBarW, scoreBarY + 6.5, { align: 'right' });

  yPos += heroCardHeight + 5;

  // ================= EXECUTIVE DECISION RATIONALE =================
  const rawRationale = sanitizeText(data.decision_rationale);
  if (rawRationale) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const wrappedRationale = doc.splitTextToSize(rawRationale, contentWidth - 14);
    const rationaleCardHeight = 11 + wrappedRationale.length * 3.8;

    ensureSpace(rationaleCardHeight + 4);

    doc.setFillColor(...fillCard);
    doc.roundedRect(marginLeft, yPos, contentWidth, rationaleCardHeight, 2, 2, 'F');
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginLeft, yPos, contentWidth, rationaleCardHeight, 2, 2, 'S');

    // Section Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...brandBlue);
    doc.text('EXECUTIVE UNDERWRITER RATIONALE', marginLeft + 6, yPos + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textDark);
    doc.text(wrappedRationale, marginLeft + 6, yPos + 9.5);

    yPos += rationaleCardHeight + 5;
  }

  // ================= SECTION 1: FINANCIAL METRICS & AFFORDABILITY =================
  ensureSpace(60);

  // Section Header
  doc.setFillColor(...brandNavy);
  doc.rect(marginLeft, yPos, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...brandDark);
  doc.text('1. FINANCIAL SERVICEABILITY & PRUDENTIAL RATIOS', marginLeft + 6, yPos + 4.8);

  yPos += 8;

  // Two side-by-side cards with strict cell geometry
  const colGap = 4;
  const colWidth = (contentWidth - colGap) / 2; // 89mm
  const cardHeight = 46;

  const leftCardX = marginLeft;
  const rightCardX = marginLeft + colWidth + colGap;

  const metrics = data.financial_metrics;

  // Draw Left Card: Facility & Monthly Commitments
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftCardX, yPos, colWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftCardX, yPos, colWidth, cardHeight, 2, 2, 'S');

  // Left card header
  doc.setFillColor(...fillZebra);
  doc.rect(leftCardX, yPos, colWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandDark);
  doc.text('CREDIT FACILITY & CASH FLOW OBLIGATIONS', leftCardX + 4, yPos + 4.8);

  const leftRows = [
    { label: 'Requested Loan Amount', val: formatCurrency(data.input_data.loan_amount * 1000) },
    {
      label: 'Repayment Tenure',
      val: `${data.input_data.loan_amount_term} Mo (${(data.input_data.loan_amount_term / 12).toFixed(1)} yr)`,
    },
    { label: 'Proposed Monthly EMI', val: `${formatCurrency(metrics.proposed_emi)}/mo` },
    { label: 'Annual Interest Rate (APR)', val: `${metrics.annual_interest_rate_pct.toFixed(2)}% p.a.` },
    { label: 'Existing Monthly Debts', val: `${formatCurrency(data.input_data.existing_monthly_emi)}/mo` },
  ];

  let leftRowY = yPos + 12;
  leftRows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(...fillCard);
      doc.rect(leftCardX + 1, leftRowY - 3.5, colWidth - 2, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text(r.label, leftCardX + 4, leftRowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...brandDark);
    doc.text(r.val, leftCardX + colWidth - 4, leftRowY, { align: 'right' });

    leftRowY += 7;
  });

  // Draw Right Card: Income & Prudential Underwriting Ratios
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightCardX, yPos, colWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.roundedRect(rightCardX, yPos, colWidth, cardHeight, 2, 2, 'S');

  // Right card header
  doc.setFillColor(...fillZebra);
  doc.rect(rightCardX, yPos, colWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandDark);
  doc.text('INCOME CAPACITY & PRUDENTIAL RATIOS', rightCardX + 4, yPos + 4.8);

  const rightRows = [
    { label: 'Gross Monthly Income', val: `${formatCurrency(metrics.total_gross_monthly_income)}/mo` },
    { label: 'Net Monthly Income', val: `${formatCurrency(metrics.total_net_monthly_income)}/mo` },
    { label: 'Debt-to-Income (DTI)', val: `${metrics.dti_pct.toFixed(1)}% (Cap: 40%)` },
    { label: 'Fixed Obligation (FOIR)', val: `${metrics.foir_pct.toFixed(1)}% (Cap: 50%)` },
    {
      label: 'Disposable Cash Buffer',
      val: `${formatCurrency(metrics.disposable_income)}/mo`,
      highlight: metrics.disposable_income > 0,
    },
  ];

  let rightRowY = yPos + 12;
  rightRows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(...fillCard);
      doc.rect(rightCardX + 1, rightRowY - 3.5, colWidth - 2, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text(r.label, rightCardX + 4, rightRowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (r.highlight !== undefined) {
      doc.setTextColor(r.highlight ? 5 : 225, r.highlight ? 150 : 29, r.highlight ? 105 : 72);
    } else {
      doc.setTextColor(...brandDark);
    }
    doc.text(r.val, rightCardX + colWidth - 4, rightRowY, { align: 'right' });

    rightRowY += 7;
  });

  yPos += cardHeight + 6;

  // ================= SECTION 2: APPLICANT PROFILE SNAPSHOT =================
  ensureSpace(28);

  doc.setFillColor(...brandNavy);
  doc.rect(marginLeft, yPos, 3, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...brandDark);
  doc.text('2. APPLICANT UNDERWRITING PROFILE', marginLeft + 6, yPos + 4);

  yPos += 7;

  const profileGridW = (contentWidth - 6) / 3;
  const profileGridH = 14;

  const profilePills = [
    {
      title: 'EMPLOYMENT & TENURE',
      line1: `Category: ${(data.input_data.employment_category || 'Salaried').toUpperCase()}`,
      line2: `Tenure: ${data.input_data.employment_duration_months || 24} Months`,
    },
    {
      title: 'BUREAU & REPAYMENT RECORD',
      line1:
        data.input_data.credit_history === '1'
          ? 'Satisfactory History (Code: 1)'
          : data.input_data.credit_history === '0'
          ? 'Prior Arrears/Default (Code: 0)'
          : 'No Prior Bureau History',
      line2: data.input_data.credit_score ? `Bureau Score: ${data.input_data.credit_score}` : 'Score: Benchmark Default',
    },
    {
      title: 'COLLATERAL & SECURITY',
      line1: `Area: ${data.input_data.property_area || 'Urban'} Area`,
      line2:
        metrics.ltv_pct !== null ? `Secured LTV: ${metrics.ltv_pct.toFixed(1)}%` : 'Facility: Unsecured / Personal',
    },
  ];

  profilePills.forEach((item, idx) => {
    const x = marginLeft + idx * (profileGridW + 3);
    doc.setFillColor(...fillCard);
    doc.roundedRect(x, yPos, profileGridW, profileGridH, 1.5, 1.5, 'F');
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, yPos, profileGridW, profileGridH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...brandBlue);
    doc.text(item.title, x + 3.5, yPos + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...textDark);
    doc.text(sanitizeText(item.line1), x + 3.5, yPos + 8);
    doc.text(sanitizeText(item.line2), x + 3.5, yPos + 11.5);
  });

  yPos += profileGridH + 6;

  // ================= SECTION 3: DECISION FACTORS & AI EXPLAINABILITY =================
  if (data.applicant_factors && data.applicant_factors.length > 0) {
    ensureSpace(24);

    doc.setFillColor(...brandNavy);
    doc.rect(marginLeft, yPos, 3, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...brandDark);
    doc.text('3. AI DECISION DRIVERS & RISK FACTOR EXPLAINABILITY', marginLeft + 6, yPos + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...textMuted);
    doc.text(
      `Engine: ${sanitizeText(data.model_name)}  |  Model Version: ${data.model_version}`,
      pageWidth - marginRight,
      yPos + 4,
      { align: 'right' }
    );

    yPos += 7;

    data.applicant_factors.forEach((f) => {
      const isPositiveFactor = f.impact === 'positive';
      const isNegativeFactor = f.impact === 'negative';

      const factorStripeColor: [number, number, number] = isPositiveFactor
        ? [16, 185, 129] // Emerald
        : isNegativeFactor
        ? [225, 29, 72] // Rose
        : [100, 116, 139]; // Slate

      const factorBadgeBg: [number, number, number] = isPositiveFactor
        ? [236, 253, 245]
        : isNegativeFactor
        ? [255, 241, 242]
        : [241, 245, 249];

      const factorBadgeText: [number, number, number] = isPositiveFactor
        ? [6, 95, 70]
        : isNegativeFactor
        ? [159, 18, 57]
        : [51, 65, 85];

      // Measure description lines
      const cleanDesc = sanitizeText(f.description);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      const descLines = doc.splitTextToSize(cleanDesc, contentWidth - 14);
      const cardH = 9 + descLines.length * 3.6;

      ensureSpace(cardH + 3);

      // Card Background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(marginLeft, yPos, contentWidth, cardH, 1.5, 1.5, 'F');
      doc.setDrawColor(...borderLight);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, yPos, contentWidth, cardH, 1.5, 1.5, 'S');

      // Left Accent Strip
      doc.setFillColor(...factorStripeColor);
      doc.roundedRect(marginLeft, yPos, 2.5, cardH, 1, 1, 'F');

      // Factor Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...brandDark);
      doc.text(sanitizeText(f.factor), marginLeft + 6, yPos + 5);

      // Impact Badge on right
      const badgeW = 28;
      const badgeX = pageWidth - marginRight - badgeW - 3;
      doc.setFillColor(...factorBadgeBg);
      doc.roundedRect(badgeX, yPos + 1.8, badgeW, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(...factorBadgeText);
      const badgeLabel = isPositiveFactor ? '+ POSITIVE MITIGANT' : isNegativeFactor ? '- RISK FACTOR' : 'NEUTRAL FACTOR';
      doc.text(badgeLabel, badgeX + badgeW / 2, yPos + 4.8, { align: 'center' });

      // Factor Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textDark);
      doc.text(descLines, marginLeft + 6, yPos + 8.5);

      yPos += cardH + 2.5;
    });

    yPos += 2;
  }

  // ================= SECTION 4: RECOMMENDED NEXT STEPS & ACTIONS =================
  if (data.next_steps && data.next_steps.length > 0) {
    ensureSpace(20);

    doc.setFillColor(...brandNavy);
    doc.rect(marginLeft, yPos, 3, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...brandDark);
    doc.text('4. UNDERWRITING NEXT STEPS & STIPULATIONS', marginLeft + 6, yPos + 4);

    yPos += 7;

    const stepsCardH = 4 + data.next_steps.length * 4.6;
    ensureSpace(stepsCardH + 3);

    doc.setFillColor(...fillCard);
    doc.roundedRect(marginLeft, yPos, contentWidth, stepsCardH, 1.5, 1.5, 'F');
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, yPos, contentWidth, stepsCardH, 1.5, 1.5, 'S');

    let stepY = yPos + 4;
    data.next_steps.forEach((step, idx) => {
      doc.setFillColor(...brandBlue);
      doc.circle(marginLeft + 5, stepY - 1, 1.2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...brandBlue);
      doc.text(`${idx + 1}.`, marginLeft + 7.5, stepY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textDark);
      doc.text(sanitizeText(step), marginLeft + 12, stepY);

      stepY += 4.6;
    });

    yPos += stepsCardH + 4;
  }

  // Missing or unverified items alert if present
  if (data.missing_or_unverified_items && data.missing_or_unverified_items.length > 0) {
    const alertH = 6 + data.missing_or_unverified_items.length * 4;
    ensureSpace(alertH + 3);

    doc.setFillColor(254, 243, 199); // Amber 50
    doc.roundedRect(marginLeft, yPos, contentWidth, alertH, 1.5, 1.5, 'F');
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginLeft, yPos, contentWidth, alertH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    doc.text('PENDING DOCUMENTATION & VERIFICATION REQUIRED:', marginLeft + 4, yPos + 4.5);

    let docY = yPos + 8;
    data.missing_or_unverified_items.forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(120, 53, 15);
      doc.text(`* ${sanitizeText(item)}`, marginLeft + 6, docY);
      docY += 4;
    });

    yPos += alertH + 4;
  }

  // ================= SECTION 5: GOVERNANCE & EDUCATIONAL NOTICE =================
  ensureSpace(24);

  const noticeH = 18;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginLeft, yPos, contentWidth, noticeH, 1.5, 1.5, 'F');
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, yPos, contentWidth, noticeH, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...brandDark);
  doc.text('INSTITUTIONAL GOVERNANCE & REGULATORY DISCLAIMER', marginLeft + 5, yPos + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(...textMuted);
  const disclaimerText =
    'This assessment report is generated by LoanIQ for automated credit underwriting research, prototyping demonstration, and computational ' +
    'affordability auditing. Predictions, DTI/FOIR stress tests, and calibrated serviceability scores are algorithmic estimates ' +
    'and do not constitute a legally binding loan sanction letter or credit commitment. Formal loan execution requires licensed underwriter approval and verified statutory credit bureau records.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disclaimerLines, marginLeft + 5, yPos + 8.5);

  // ================= RUNNING FOOTERS ON ALL PAGES =================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Subtle footer separator line
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, pageHeight - 11, pageWidth - marginRight, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...textSubtle);
    doc.text('LoanIQ Underwriting Suite  |  Confidential Risk Intelligence', marginLeft, pageHeight - 6.5);

    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Generated: ${nowStr}`, pageWidth / 2, pageHeight - 6.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginRight, pageHeight - 6.5, { align: 'right' });
  }

  // Trigger download in browser
  doc.save(`${data.application_id}_LoanIQ_Underwriting_Dossier.pdf`);
}
