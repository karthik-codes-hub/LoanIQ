import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { runLoanAssessment, MODEL_EVALUATION } from './src/server/mlEngine.ts';
import { getApplications, saveApplicationRecord, getApplicationById, deleteApplicationRecord } from './src/server/db.ts';
import { LoanApplicationInput } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── API ROUTES ──────────────────────────────────────────────────────────────

  // Health / System status
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'LoanIQ — AI-Powered Loan Approval and Credit Risk Assessment System',
      version: '2.0.0',
      ml_model: 'Random Forest Classifier + Real-World Financial Affordability Engine',
      features_count: 10,
      supported_loan_types: ['personal', 'home', 'vehicle', 'business'],
    });
  });

  // Model Evaluation Metrics (Kaggle benchmark 614 rows)
  app.get('/api/model/evaluation', (_req: Request, res: Response) => {
    res.json(MODEL_EVALUATION);
  });

  // Predict / Assessment Endpoint
  app.post('/api/predict', (req: Request, res: Response) => {
    try {
      const body = req.body;

      // Validation
      const errors: Record<string, string> = {};

      const loanType = body.loan_type || 'personal';
      if (!['personal', 'home', 'vehicle', 'business'].includes(loanType)) {
        errors.loan_type = 'Invalid loan type selected.';
      }

      if (!body.loan_purpose || !body.loan_purpose.trim()) {
        errors.loan_purpose = 'Loan purpose is required.';
      }

      const loanAmount = Number(body.loan_amount);
      if (isNaN(loanAmount) || loanAmount <= 0) {
        errors.loan_amount = 'Requested loan amount must be greater than zero.';
      }

      const loanTerm = Number(body.loan_amount_term);
      if (isNaN(loanTerm) || loanTerm < 1) {
        errors.loan_amount_term = 'Tenure must be at least 1 month.';
      }

      const applicantIncome = Number(body.applicant_income);
      if (isNaN(applicantIncome) || applicantIncome < 0) {
        errors.applicant_income = 'Gross monthly income must be a non-negative number.';
      }

      const netIncome = Number(body.net_monthly_income);
      if (isNaN(netIncome) || netIncome < 0) {
        errors.net_monthly_income = 'Net take-home monthly income must be a non-negative number.';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }

      const input: LoanApplicationInput = {
        loan_type: loanType,
        loan_purpose: body.loan_purpose || 'General financing',
        loan_amount: loanAmount,
        loan_amount_term: loanTerm,
        interest_rate: Number(body.interest_rate) || 9.5,
        collateral_type: body.collateral_type,
        collateral_value: Number(body.collateral_value) || 0,
        down_payment: Number(body.down_payment) || 0,

        married: body.married || 'No',
        dependents: body.dependents || '0',
        education: body.education || 'Graduate',
        self_employed: body.self_employed || 'No',
        employment_category: body.employment_category || 'salaried',
        employment_duration_months: Number(body.employment_duration_months) || 24,
        applicant_income: applicantIncome,
        net_monthly_income: netIncome || applicantIncome * 0.82,
        additional_monthly_income: Number(body.additional_monthly_income) || 0,
        coapplicant_income: Number(body.coapplicant_income) || 0,
        business_turnover: Number(body.business_turnover) || 0,
        business_operating_costs: Number(body.business_operating_costs) || 0,
        business_net_profit: Number(body.business_net_profit) || 0,

        existing_monthly_emi: Number(body.existing_monthly_emi) || 0,
        other_monthly_debt: Number(body.other_monthly_debt) || 0,
        credit_card_outstanding: Number(body.credit_card_outstanding) || 0,
        credit_card_limit: Number(body.credit_card_limit) || 0,
        essential_living_expenses: Number(body.essential_living_expenses) || 0,

        has_credit_history: body.has_credit_history !== false,
        credit_history: body.credit_history || '1',
        credit_score: body.credit_score ? Number(body.credit_score) : null,
        late_payments_defaults: Boolean(body.late_payments_defaults),
        recent_credit_enquiries: Number(body.recent_credit_enquiries) || 0,
        credit_history_length_months: Number(body.credit_history_length_months) || 36,

        property_area: body.property_area || 'Urban',

        income_verification_status: body.income_verification_status || 'self_declared',
        consent_given: Boolean(body.consent_given),
        declaration_accepted: Boolean(body.declaration_accepted),
      };

      const result = runLoanAssessment(input);

      // Save to application history database
      saveApplicationRecord(result);

      return res.json(result);
    } catch (err: any) {
      console.error('Assessment error:', err);
      return res.status(500).json({ error: 'Inference error', message: err?.message });
    }
  });

  // Get Applications History
  app.get('/api/applications', (req: Request, res: Response) => {
    let applications = getApplications();

    const search = (req.query.search as string)?.trim().toLowerCase();
    const loanType = req.query.loan_type as string;
    const outcome = req.query.outcome as string;
    const sortDir = (req.query.sort_dir as string) || 'desc';

    if (search) {
      applications = applications.filter(
        (a) =>
          a.application_id.toLowerCase().includes(search) ||
          a.loan_type.toLowerCase().includes(search) ||
          a.assessment_outcome.toLowerCase().includes(search)
      );
    }

    if (loanType && loanType !== 'all') {
      applications = applications.filter((a) => a.loan_type === loanType);
    }

    if (outcome && outcome !== 'all') {
      applications = applications.filter((a) => a.assessment_outcome.toLowerCase().includes(outcome.toLowerCase()));
    }

    applications.sort((a, b) => {
      const timeA = new Date(a.submitted_at).getTime();
      const timeB = new Date(b.submitted_at).getTime();
      return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
    });

    res.json({
      total: applications.length,
      applications,
    });
  });

  // Get Single Application Detail
  app.get('/api/applications/:id', (req: Request, res: Response) => {
    const record = getApplicationById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.json(record);
  });

  // Delete Application
  app.delete('/api/applications/:id', (req: Request, res: Response) => {
    const deleted = deleteApplicationRecord(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found or could not be removed' });
    }
    return res.json({ success: true, message: 'Application record removed' });
  });

  // CSV Export with complete financial ratios
  app.get('/api/export/csv', (_req: Request, res: Response) => {
    const list = getApplications();
    const headers = [
      'Application_ID',
      'Submitted_At',
      'Loan_Type',
      'Requested_Amount_Thousands',
      'Tenure_Months',
      'Interest_Rate_Pct',
      'Proposed_Monthly_EMI',
      'Gross_Monthly_Income',
      'Net_Monthly_Income',
      'DTI_Pct',
      'FOIR_Pct',
      'Disposable_Income',
      'Credit_Utilization_Pct',
      'LTV_Pct',
      'Credit_Risk_Tier',
      'Assessment_Outcome',
      'Model_Version',
    ];

    const rows = list.map((a) => [
      `"${a.application_id}"`,
      `"${a.submitted_at}"`,
      `"${a.loan_type}"`,
      a.input_data.loan_amount,
      a.input_data.loan_amount_term,
      a.financial_metrics.annual_interest_rate_pct,
      a.financial_metrics.proposed_emi,
      a.financial_metrics.total_gross_monthly_income,
      a.financial_metrics.total_net_monthly_income,
      a.financial_metrics.dti_pct,
      a.financial_metrics.foir_pct,
      a.financial_metrics.disposable_income,
      a.financial_metrics.credit_utilization_pct ?? 'N/A',
      a.financial_metrics.ltv_pct ?? 'N/A',
      `"${a.credit_risk_tier}"`,
      `"${a.assessment_outcome}"`,
      `"${a.model_version}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="loaniq_assessments.csv"');
    res.send(csvContent);
  });

  // ── VITE MIDDLEWARE / STATIC ASSETS ──────────────────────────────────────────
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoanIQ Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
