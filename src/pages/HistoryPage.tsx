import React, { useState, useEffect } from 'react';
import { StoredApplication } from '../types';
import { generateApplicationPDF } from '../utils/pdfGenerator';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HistoryPageProps {
  onSelectApplication: (id: string) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectApplication,
  onNavigate,
}) => {
  const [applications, setApplications] = useState<StoredApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Deletion state
  const [deleteIdTarget, setDeleteIdTarget] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (loanTypeFilter !== 'all') params.append('loan_type', loanTypeFilter);
      if (outcomeFilter !== 'all') params.append('outcome', outcomeFilter);
      params.append('sort_dir', sortDir);

      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.applications && Array.isArray(data.applications)) {
          setApplications(data.applications);
          // sync local cache
          localStorage.setItem('loaniq_applications', JSON.stringify(data.applications));
          return;
        }
      }

      // Fallback to local storage if API didn't return
      const cached = localStorage.getItem('loaniq_applications');
      if (cached) {
        let list: StoredApplication[] = JSON.parse(cached);
        if (searchTerm) {
          list = list.filter(
            (a) =>
              a.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.assessment_outcome.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (loanTypeFilter !== 'all') {
          list = list.filter((a) => a.loan_type === loanTypeFilter);
        }
        if (outcomeFilter !== 'all') {
          list = list.filter((a) =>
            a.assessment_outcome.toLowerCase().includes(outcomeFilter.toLowerCase())
          );
        }
        setApplications(list);
      } else {
        setApplications([]);
      }
    } catch (err: any) {
      console.warn('API error, reading local store:', err);
      const cached = localStorage.getItem('loaniq_applications');
      if (cached) {
        setApplications(JSON.parse(cached));
      } else {
        setError('Could not load applications from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [loanTypeFilter, outcomeFilter, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleDownloadPDF = (e: React.MouseEvent, app: StoredApplication) => {
    e.stopPropagation();
    generateApplicationPDF(app);
  };

  const handleDelete = async (appId: string) => {
    try {
      await fetch(`/api/applications/${appId}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    // Update local state and storage
    const updated = applications.filter((a) => a.application_id !== appId);
    setApplications(updated);
    localStorage.setItem('loaniq_applications', JSON.stringify(updated));
    setDeleteIdTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left space-y-8">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5]">
            <Clock className="w-3.5 h-3.5" />
            Audit Records & Past Submissions
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#101B35] dark:text-white tracking-tight mt-1">
            Assessment History
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Review past loan eligibility, affordability calculations, and ML risk evaluations recorded in your history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/export/csv"
            download="loaniq_assessments.csv"
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#19B8A5]" />
            Export CSV
          </a>

          <button
            onClick={() => onNavigate('apply')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#315CFD] hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Assessment
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#101b35] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, loan type, or status (e.g. LIQ-8E4A91, home)..."
            className="w-full pl-10 pr-24 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#315CFD]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 text-xs font-medium bg-[#315CFD] text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Outcome Filter */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Outcomes</option>
              <option value="eligible">Eligible / Approved</option>
              <option value="risk">Higher Risk / Review</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="flex items-center gap-1 text-xs">
            <select
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Loan Types</option>
              <option value="home">Home Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="vehicle">Vehicle Loan</option>
              <option value="business">Business Loan</option>
            </select>
          </div>

          {/* Sort Dir */}
          <button
            onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            {sortDir === 'desc' ? 'Newest' : 'Oldest'}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── LIST / TABLE AREA ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-[#315CFD] mb-3"></div>
          <div>Loading assessment history...</div>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#101b35] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Assessment Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchTerm || loanTypeFilter !== 'all' || outcomeFilter !== 'all'
              ? 'No applications match your active filters. Try resetting search parameters.'
              : 'You have not submitted any loan assessments yet. Start your first assessment to generate detailed affordability metrics.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('apply')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#315CFD] hover:bg-blue-600 rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Assess a Loan Now
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#101b35] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0c162d] border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Reference ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Product & Purpose</th>
                  <th className="py-4 px-6">Requested Amount</th>
                  <th className="py-4 px-6">Proposed EMI / DTI</th>
                  <th className="py-4 px-6">Assessment Outcome</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => {
                  const outcome = app.assessment_outcome || 'Eligible for further consideration';
                  const isEligible =
                    outcome.toLowerCase().includes('eligible') || outcome.toLowerCase().includes('approved');
                  const isReview = outcome.toLowerCase().includes('review');

                  const loanAmount = (app.input_data?.loan_amount ?? 150) * 1000;
                  const emi = app.financial_metrics?.proposed_emi ?? 1200;
                  const dti = app.financial_metrics?.dti_pct ?? 28;
                  const riskTier = app.credit_risk_tier || (isEligible ? 'Low' : 'Elevated');
                  const prob = (app.calibrated_probability ?? 0.85) * 100;

                  return (
                    <tr
                      key={app.application_id}
                      onClick={() => onSelectApplication(app.application_id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-bold font-mono text-slate-900 dark:text-white">
                        {app.application_id}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                        <div>{new Date(app.submitted_at).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(app.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold uppercase text-slate-800 dark:text-slate-200 block">
                          {app.loan_type || 'home'}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {app.input_data?.loan_purpose || 'General Financing'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold font-mono text-slate-900 dark:text-white">
                        ₹{Number(loanAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-300">
                        <div>₹{Number(emi).toLocaleString()}/mo</div>
                        <div className="text-[10px] text-slate-400">
                          DTI: {dti.toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold ${
                            isEligible
                              ? 'text-teal-600 dark:text-[#19B8A5]'
                              : isReview
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isEligible ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : isReview ? (
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          {outcome}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400">
                          {riskTier} Risk · {prob.toFixed(1)}% probability
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplication(app.application_id);
                          }}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="View Assessment Breakdown"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          View
                        </button>
                        <button
                          onClick={(e) => handleDownloadPDF(e, app)}
                          className="px-2.5 py-1 text-[#315CFD] dark:text-[#19B8A5] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                          title="Export PDF Document"
                        >
                          <Download className="w-3.5 h-3.5 inline mr-1" />
                          PDF
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteIdTarget(app.application_id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const outcome = app.assessment_outcome || 'Eligible for further consideration';
            const isEligible =
              outcome.toLowerCase().includes('eligible') || outcome.toLowerCase().includes('approved');
            const loanAmount = (app.input_data?.loan_amount ?? 150) * 1000;
            const emi = app.financial_metrics?.proposed_emi ?? 1200;
            const prob = (app.calibrated_probability ?? 0.85) * 100;

            return (
              <div
                key={app.application_id}
                onClick={() => onSelectApplication(app.application_id)}
                className="bg-white dark:bg-[#101b35] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#315CFD]/40 dark:hover:border-[#19B8A5]/40 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      {app.application_id}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isEligible
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {isEligible ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isEligible ? 'Eligible' : 'Higher Risk'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                      {app.loan_type} Loan
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {app.input_data?.loan_purpose || 'General Financing'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Requested Amount</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Proposed EMI</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{emi.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Probability meter */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400">Model Probability:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{prob.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isEligible ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${prob}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDownloadPDF(e, app)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <span className="text-[#315CFD] dark:text-[#19B8A5] font-semibold text-xs flex items-center gap-0.5">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── IN-APP DELETE CONFIRMATION MODAL (NO WINDOW.CONFIRM) ───────────── */}
      {deleteIdTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#101b35] rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Application Record?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete record <strong className="font-mono text-slate-900 dark:text-white">{deleteIdTarget}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteIdTarget(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteIdTarget)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
