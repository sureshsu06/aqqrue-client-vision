import React from "react";

// Content for different sections
export const sopContent = {
  "overview": {
    "purpose-scope": {
      title: "Purpose & Scope",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              OVERVIEW
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              PURPOSE & SCOPE
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
                This section contains workflow visualizations for all accounting operations within the organization. The scope covers all financial processes from basic journal entries to complex month-end close procedures.
              </p>
            
            <div>
                <h3 className="font-semibold text-[var(--primary)] mb-2">Key Objectives</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Visualize workflow processes for all accounting operations</li>
                  <li>Provide interactive workflow diagrams for team members</li>
                  <li>Streamline understanding of complex financial processes</li>
                  <li>Enable efficient process navigation and training</li>
                </ul>
            </div>
          </div>
        </div>
      )
    },
    "audience-access": {
      title: "Audience & Access Level",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              OVERVIEW
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              AUDIENCE & ACCESS LEVEL
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              This section defines the target audience and access levels for the accounting workflow documentation.
            </p>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">Primary Users</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Accounting Team</li>
                    <li>• Finance Controllers</li>
                    <li>• CFO & Finance Leadership</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">Access Levels</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Read-only: All employees</li>
                    <li>• Edit: Accounting team</li>
                    <li>• Admin: Controllers & CFO</li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
  "month-end-close": {
    "close-calendar": {
      title: "Close Calendar & Timeline",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Month-End Close
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              📅 Close Calendar & Timeline
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Month-end close calendar workflow with day-by-day timeline and responsibilities.
            </p>
            
            <div>
                <p className="text-sm text-[var(--text)]">This section will contain the detailed close calendar workflow visualization.</p>
            </div>
          </div>
        </div>
      )
    },
    "accruals-provisions": {
      title: "Accruals & Provisions",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Month-End Close
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Accruals & Provisions
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Standard Operating Procedure for identifying, calculating, recording, and reversing accruals and provisions as part of the month-end close.
            </p>

            {/* SOP Content */}
            <div className="prose prose-gray max-w-none text-sm">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Document ID:</strong> MEC-ACR-01</div>
                      <div><strong>Process Owner:</strong> General Ledger Controller</div>
                      <div><strong>Version:</strong> 1.4</div>
                      <div><strong>Effective Date:</strong> October 1, 2025</div>
                      <div><strong>Last Updated:</strong> September 2025</div>
                      <div><strong>Frequency:</strong> Monthly</div>
                      <div><strong>Status:</strong> <span className="text-green-600">✅ Active</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 id="purpose" className="text-xl font-semibold text-gray-900 mb-6">Purpose</h3>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">
                This SOP defines the process for identifying, calculating, recording, and reversing accruals and provisions as part of the month-end close.
                The objective is to ensure expenses are recorded in the correct accounting period in accordance with U.S. GAAP and company policy <strong>POL-AC-02: Expense Recognition</strong>.
              </p>

              <h3 id="scope" className="text-xl font-semibold text-gray-900 mb-6">Scope</h3>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                This procedure applies to all U.S. entities and subsidiaries consolidated into the corporate general ledger.
                It covers:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>Expense accruals for services or goods received but not yet invoiced.</li>
                <li>Provisions for recurring or estimated liabilities (e.g., utilities, marketing retainers, SaaS subscriptions).</li>
              </ul>

              <h3 id="roles" className="text-xl font-semibold text-gray-900 mb-6">Roles & Responsibilities</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Entity Accountant</td>
                      <td className="border border-gray-300 px-4 py-2">Identify unbilled services and compile the accrual list.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Department Owner</td>
                      <td className="border border-gray-300 px-4 py-2">Validate estimated amounts and provide supporting documentation (usage reports, contracts).</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">GL Accountant</td>
                      <td className="border border-gray-300 px-4 py-2">Prepare and post accrual journal entries using the standard template.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Controller</td>
                      <td className="border border-gray-300 px-4 py-2">Review support, approve accruals, and ensure reversals are processed.</td>
                    </tr>
                  </tbody>
                </table>
                </div>

              <h3 id="timing" className="text-xl font-semibold text-gray-900 mb-6">Timing</h3>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">
                Accrual entries must be posted no later than <strong>Day 4</strong> of the close calendar.
                Reversal entries must be processed automatically or manually on <strong>Day 1 of the following month</strong>.
                Exceptions must be documented in the <strong>Accrual Exception Log</strong>.
              </p>

              <h3 id="procedure" className="text-xl font-semibold text-gray-900 mb-6">Procedure</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Step</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Task</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Owner</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Deliverable</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Due Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">1</td>
                      <td className="border border-gray-300 px-3 py-2">Identify unbilled expenses</td>
                      <td className="border border-gray-300 px-3 py-2">Review open POs, service confirmations, and pending invoices in the <strong>PO Tracker (FY25-Q3)</strong>.</td>
                      <td className="border border-gray-300 px-3 py-2">Entity Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Accrual list</td>
                      <td className="border border-gray-300 px-3 py-2">2</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">2</td>
                      <td className="border border-gray-300 px-3 py-2">Estimate expense amount</td>
                      <td className="border border-gray-300 px-3 py-2">Use actual usage data or % completion to calculate accrual value. Document calculation in <strong>Accrual Justification Sheet</strong>.</td>
                      <td className="border border-gray-300 px-3 py-2">Department Owner</td>
                      <td className="border border-gray-300 px-3 py-2">Calculation support</td>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                      <td className="border border-gray-300 px-3 py-2">Prepare accrual JE</td>
                      <td className="border border-gray-300 px-3 py-2">Record the journal entry using <strong>Template JE-Accrual-01.xlsx</strong>, ensuring the "Auto-Reversal" flag is set to TRUE.</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Accrual JE</td>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                      <td className="border border-gray-300 px-3 py-2">Review and approve</td>
                      <td className="border border-gray-300 px-3 py-2">Controller reviews JE, validates support, and approves via email or Aqqrue workflow.</td>
                      <td className="border border-gray-300 px-3 py-2">Controller</td>
                      <td className="border border-gray-300 px-3 py-2">Approval record</td>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                      <td className="border border-gray-300 px-3 py-2">Post JE to ERP</td>
                      <td className="border border-gray-300 px-3 py-2">Post approved JE to <strong>NetSuite</strong> or applicable ERP. Attach all supporting files.</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Posted JE</td>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">6</td>
                      <td className="border border-gray-300 px-3 py-2">Verify reversal</td>
                      <td className="border border-gray-300 px-3 py-2">Confirm reversal entries are posted automatically on the first business day of the next month.</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Reversal JE</td>
                      <td className="border border-gray-300 px-3 py-2">+1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="controls" className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Control ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Frequency</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-MEC-01</td>
                      <td className="border border-gray-300 px-4 py-2">Accruals below <strong>$500</strong> are not recorded unless material.</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-MEC-02</td>
                      <td className="border border-gray-300 px-4 py-2">Each accrual must include a documented support (PO, contract, usage report).</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">GL Accountant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-MEC-03</td>
                      <td className="border border-gray-300 px-4 py-2">JE must include Auto-Reversal flag = TRUE.</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">ERP System</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-MEC-04</td>
                      <td className="border border-gray-300 px-4 py-2">Manual accruals greater than <strong>$10,000</strong> require Controller approval.</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Supporting evidence for review and approval must be saved in:
                    </p>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">/Finance/Month-End-Close/FY25/&lt;Month&gt;/Approvals/</code>
                  </div>
                </div>
              </div>

              <h3 id="documentation" className="text-lg font-semibold text-gray-900 mb-4">Documentation & Record Retention</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>All supporting files (Excel schedules, emails, reports) must be stored in: <code className="bg-gray-100 px-2 py-1 rounded">/Finance/Month-End-Close/FY25/&lt;Month&gt;/Accruals/</code></li>
                <li>Accrual JE numbers must align with entries in the <strong>Accrual Tracker Dashboard</strong>.</li>
                <li>Retain documentation for <strong>7 years</strong> in accordance with record retention policy <strong>POL-ADM-07</strong>.</li>
              </ul>

              <h3 id="completion" className="text-lg font-semibold text-gray-900 mb-4">Completion Criteria</h3>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">This process is considered complete when:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>All significant unbilled expenses are accrued.</li>
                <li>Accrual balances are reviewed and approved by the Controller.</li>
                <li>Accrual reversals are processed correctly in the following month.</li>
                <li>The accrual schedule reconciles with the GL within ±$100 variance.</li>
              </ul>

              <h3 id="issues" className="text-lg font-semibold text-gray-900 mb-4">Common Issues & Mitigation</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Issue</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Impact</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Incomplete PO tracker</td>
                      <td className="border border-gray-300 px-4 py-2">Missed accruals</td>
                      <td className="border border-gray-300 px-4 py-2">Procurement to update PO tracker weekly prior to close.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Delayed department estimates</td>
                      <td className="border border-gray-300 px-4 py-2">Close delays</td>
                      <td className="border border-gray-300 px-4 py-2">Controller escalates by Day 3 to Department Head.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Manual reversal missed</td>
                      <td className="border border-gray-300 px-4 py-2">Duplicate expense in next month</td>
                      <td className="border border-gray-300 px-4 py-2">Auto-reversal flag mandatory in ERP. Controller reviews reversal log.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="escalation" className="text-lg font-semibold text-gray-900 mb-4">Escalation Protocol</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>Accruals exceeding <strong>$50,000</strong> pending by Day 4 must be escalated to the CFO.</li>
                <li>If reversal fails on Day 1, a manual JE must be posted by Day 2 and logged in the <strong>Accrual Exception Tracker</strong>.</li>
                <li>Exceptions greater than <strong>$25,000</strong> must include a root cause analysis within 5 business days.</li>
              </ul>

              <h3 id="references" className="text-lg font-semibold text-gray-900 mb-4">References</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li><strong>POL-AC-02</strong> – Expense Recognition Policy</li>
                <li><strong>POL-JE-01</strong> – Journal Entry Policy</li>
                <li><strong>POL-MEC-04</strong> – Month-End Close Calendar</li>
                <li><strong>Template:</strong> JE-Accrual-01.xlsx</li>
                <li><strong>Tracker:</strong> Accrual Tracker FY25 (Google Sheets)</li>
              </ul>

              <h3 id="revision" className="text-lg font-semibold text-gray-900 mb-4">Revision History</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Version</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description of Change</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Author</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.0</td>
                      <td className="border border-gray-300 px-4 py-2">May 2024</td>
                      <td className="border border-gray-300 px-4 py-2">Initial SOP creation</td>
                      <td className="border border-gray-300 px-4 py-2">Finance Ops</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.2</td>
                      <td className="border border-gray-300 px-4 py-2">Apr 2025</td>
                      <td className="border border-gray-300 px-4 py-2">Updated approval matrix</td>
                      <td className="border border-gray-300 px-4 py-2">GL Controller</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.4</td>
                      <td className="border border-gray-300 px-4 py-2">Sep 2025</td>
                      <td className="border border-gray-300 px-4 py-2">Added escalation thresholds and automation reference</td>
                      <td className="border border-gray-300 px-4 py-2">GL Controller</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="automations" className="text-lg font-semibold text-gray-900 mb-4">Linked Automations</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li><strong>Automation ID #12 – Accrual Reversal Bot:</strong> Automatically reverses all JEs flagged TRUE in NetSuite.</li>
                <li><strong>Automation ID #27 – Accrual Tracker Dashboard:</strong> Aggregates status and approval completion by entity.</li>
              </ul>

              <h3 id="signoff" className="text-lg font-semibold text-gray-900 mb-4">Sign-Off</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Signature</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">[Name]</td>
                      <td className="border border-gray-300 px-4 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-4 py-2">__________</td>
                      <td className="border border-gray-300 px-4 py-2">______</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">[Name]</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                      <td className="border border-gray-300 px-4 py-2">__________</td>
                      <td className="border border-gray-300 px-4 py-2">______</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">[Name]</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                      <td className="border border-gray-300 px-4 py-2">__________</td>
                      <td className="border border-gray-300 px-4 py-2">______</td>
                    </tr>
                  </tbody>
                </table>
                </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">✅ <strong>Status:</strong> Active</p>
                <p className="text-green-800">📅 <strong>Next Review Date:</strong> March 2026</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
  "accounts-payable": {
    "vendor-master-creation": {
      title: "Vendor Master Creation",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Accounts Payable
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Vendor Master Creation
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the vendor invoice approval process including validation, approval routing, and posting to accounts payable.
            </p>
          </div>
        </div>
      )
    },
    "prepaid-expenses": {
      title: "Prepaid Expenses Policy",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Accounts Payable
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Prepaid Expenses Policy
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Policy for identifying, recording, and amortizing prepaid expenses in accordance with U.S. GAAP and company accounting standards.
            </p>

            {/* SOP Content */}
            <div className="prose prose-gray max-w-none text-sm">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Document ID:</strong> AP-PRE-01</div>
                      <div><strong>Process Owner:</strong> General Ledger Controller</div>
                      <div><strong>Version:</strong> 1.0</div>
                      <div><strong>Effective Date:</strong> October 1, 2025</div>
                      <div><strong>Last Updated:</strong> October 2025</div>
                      <div><strong>Frequency:</strong> As needed</div>
                      <div><strong>Status:</strong> <span className="text-green-600">✅ Active</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 id="purpose" className="text-xl font-semibold text-gray-900 mb-6">Purpose</h3>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">
                This policy establishes the criteria for identifying, recording, and amortizing prepaid expenses in accordance with U.S. GAAP and company accounting standards. 
                It ensures proper expense recognition timing and maintains accurate financial reporting.
              </p>

              <h3 id="scope" className="text-xl font-semibold text-gray-900 mb-6">Scope</h3>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                This policy applies to all U.S. entities and subsidiaries. It covers:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2 text-sm leading-relaxed">
                <li>Quarterly software subscriptions exceeding $500</li>
                <li>Annual insurance premiums</li>
                <li>Prepaid rent and lease payments</li>
                <li>Other prepaid services with future benefit periods</li>
              </ul>

              <h3 id="classification" className="text-xl font-semibold text-gray-900 mb-6">Classification Criteria</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Expense Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Threshold</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Amortization Period</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Software Subscriptions</td>
                      <td className="border border-gray-300 px-4 py-2">$500+ quarterly</td>
                      <td className="border border-gray-300 px-4 py-2">Subscription period</td>
                      <td className="border border-gray-300 px-4 py-2">1003 Prepaid Software</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Insurance Premiums</td>
                      <td className="border border-gray-300 px-4 py-2">$1,000+ annual</td>
                      <td className="border border-gray-300 px-4 py-2">Policy period</td>
                      <td className="border border-gray-300 px-4 py-2">1005 Prepaid Insurance</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Rent & Lease</td>
                      <td className="border border-gray-300 px-4 py-2">Any prepaid amount</td>
                      <td className="border border-gray-300 px-4 py-2">Coverage period</td>
                      <td className="border border-gray-300 px-4 py-2">1004 Prepaid Rent</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Other Services</td>
                      <td className="border border-gray-300 px-4 py-2">$2,000+ annual</td>
                      <td className="border border-gray-300 px-4 py-2">Service period</td>
                      <td className="border border-gray-300 px-4 py-2">1006 Other Prepaid</td>
                    </tr>
                  </tbody>
                </table>
              </div>



              <h4 className="text-lg font-semibold text-gray-900 mb-4">Initial Recognition</h4>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>Record at <strong>cost</strong> (invoice amount including applicable taxes)</li>
                <li>Debit appropriate prepaid expense account</li>
                <li>Credit accounts payable or cash</li>
                <li>Document the prepaid period and amortization schedule</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Amortization</h4>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>Amortize on a <strong>straight-line basis</strong> over the benefit period</li>
                <li>Monthly amortization entries are required</li>
                <li>Use the <strong>Prepaid Expense Amortization Template (PRE-AMT-01.xlsx)</strong></li>
                <li>Review and adjust for any changes in service periods</li>
              </ul>

              <h3 id="procedure" className="text-xl font-semibold text-gray-900 mb-6">Procedure</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Step</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Task</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Owner</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">1</td>
                      <td className="border border-gray-300 px-3 py-2">Identify prepaid expense</td>
                      <td className="border border-gray-300 px-3 py-2">Review invoices for prepaid amounts meeting threshold criteria</td>
                      <td className="border border-gray-300 px-3 py-2">AP Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Upon receipt</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">2</td>
                      <td className="border border-gray-300 px-3 py-2">Create prepaid schedule</td>
                      <td className="border border-gray-300 px-3 py-2">Set up amortization schedule in template with start/end dates</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Within 2 days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">3</td>
                      <td className="border border-gray-300 px-3 py-2">Record initial entry</td>
                      <td className="border border-gray-300 px-3 py-2">Post prepaid expense journal entry with supporting documentation</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Within 3 days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">4</td>
                      <td className="border border-gray-300 px-3 py-2">Monthly amortization</td>
                      <td className="border border-gray-300 px-3 py-2">Post monthly amortization entries using automated template</td>
                      <td className="border border-gray-300 px-3 py-2">GL Accountant</td>
                      <td className="border border-gray-300 px-3 py-2">Month-end close</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">5</td>
                      <td className="border border-gray-300 px-3 py-2">Review and reconcile</td>
                      <td className="border border-gray-300 px-3 py-2">Verify prepaid balances and ensure complete amortization</td>
                      <td className="border border-gray-300 px-3 py-2">Controller</td>
                      <td className="border border-gray-300 px-3 py-2">Monthly</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="journal-entries" className="text-xl font-semibold text-gray-900 mb-6">Example Journal Entries</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Transaction</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Account</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Debit</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Credit</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Initial prepaid</td>
                      <td className="border border-gray-300 px-3 py-2">1003 Prepaid Software</td>
                      <td className="border border-gray-300 px-3 py-2">$2,400</td>
                      <td className="border border-gray-300 px-3 py-2">2100 Accounts Payable</td>
                      <td className="border border-gray-300 px-3 py-2">Annual Zoom subscription</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Monthly amortization</td>
                      <td className="border border-gray-300 px-3 py-2">6210 Software Subscriptions</td>
                      <td className="border border-gray-300 px-3 py-2">$200</td>
                      <td className="border border-gray-300 px-3 py-2">1003 Prepaid Software</td>
                      <td className="border border-gray-300 px-3 py-2">Monthly Zoom amortization</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="controls" className="text-xl font-semibold text-gray-900 mb-6">Controls</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Control ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Frequency</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-PRE-01</td>
                      <td className="border border-gray-300 px-4 py-2">All prepaid expenses &gt;$500 must be amortized</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">GL Accountant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-PRE-02</td>
                      <td className="border border-gray-300 px-4 py-2">Amortization schedules reviewed quarterly</td>
                      <td className="border border-gray-300 px-4 py-2">Quarterly</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-PRE-03</td>
                      <td className="border border-gray-300 px-4 py-2">Prepaid balances reconciled to GL monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">GL Accountant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-PRE-04</td>
                      <td className="border border-gray-300 px-4 py-2">Supporting documentation retained for 7 years</td>
                      <td className="border border-gray-300 px-4 py-2">Ongoing</td>
                      <td className="border border-gray-300 px-4 py-2">Accounting</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="documentation" className="text-lg font-semibold text-gray-900 mb-4">Documentation & Record Retention</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>All prepaid expense schedules stored in: <code className="bg-gray-100 px-2 py-1 rounded">/Finance/Prepaid-Expenses/FY25/</code></li>
                <li>Supporting invoices and contracts retained for <strong>7 years</strong></li>
                <li>Amortization templates maintained with version control</li>
                <li>Quarterly review documentation signed by Controller</li>
              </ul>

              <h3 id="references" className="text-lg font-semibold text-gray-900 mb-4">References</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li><strong>ASC 720-25:</strong> Prepaid Expenses</li>
                <li><strong>POL-AC-02:</strong> Expense Recognition Policy</li>
                <li><strong>Template:</strong> PRE-AMT-01.xlsx (Amortization Schedule)</li>
                <li><strong>HubSpot Invoice Policy:</strong> Quarterly software subscriptions exceeding $500</li>
              </ul>

              <h3 id="revision" className="text-lg font-semibold text-gray-900 mb-4">Revision History</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Version</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description of Change</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Author</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.0</td>
                      <td className="border border-gray-300 px-4 py-2">Oct 2025</td>
                      <td className="border border-gray-300 px-4 py-2">Initial policy creation aligned with HubSpot invoice policy</td>
                      <td className="border border-gray-300 px-4 py-2">Finance Ops</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">✅ <strong>Status:</strong> Active</p>
                <p className="text-green-800">📅 <strong>Next Review Date:</strong> April 2026</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
  "journals-adjustments": {
    "accrual-journal-entry": {
      title: "Accrual Journal Entry",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Journals & Adjustments
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Accrual Journal Entry
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the accrual journal entry process including identification, calculation, creation, approval, and posting.
            </p>
          </div>
        </div>
      )
    }
  },
  "cash-bank-management": {
    "unreconciled-items-aging": {
      title: "Unreconciled Items Aging",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Cash & Bank Management
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Unreconciled Items Aging
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the prepaid payment reconciliation process including bank data fetching, payment matching, and account updates.
            </p>
          </div>
        </div>
      )
    }
  },
  "fixed-assets": {
    "asset-disposal": {
      title: "Asset Disposal",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Fixed Assets
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Asset Disposal
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the asset disposal process including request initiation, approval, ERP updates, and documentation.
            </p>
          </div>
        </div>
      )
    }
  },
  "payroll-benefits": {
    "expense-reimbursement": {
      title: "Expense Reimbursement Process",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Payroll & Benefits
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Expense Reimbursement Process
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the corporate card transaction posting process including transaction fetching, matching, and AP posting.
            </p>
          </div>
        </div>
      )
    }
  },
  "internal-controls": {
    "manual-journal-review": {
      title: "Review of Manual Journal Entries",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Internal Controls
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Review of Manual Journal Entries
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Interactive workflow showing the manual journal entry review process including extraction, filtering, documentation review, and approval verification.
            </p>
          </div>
        </div>
      )
    }
  },
  "corporate-credit-card": {
    "reconciliation-accounting": {
      title: "Reconciliation & Accounting",
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            {/* Section Header - smaller font */}
            <p className="text-sm font-medium text-blue-600 mb-2">
              Corporate Credit Card
            </p>
            
            {/* Sub-section Title - large and semi-bold */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Reconciliation & Accounting
            </h2>
            
            {/* Sub-section Description - medium grey */}
            <p className="text-base text-gray-600 mb-6">
              Standard Operating Procedure for reconciling corporate credit card transactions (Brex) with the general ledger, ensuring completeness, accuracy, and compliance with expense recognition policies.
            </p>

            {/* SOP Content */}
            <div className="prose prose-gray max-w-none text-sm">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Document ID:</strong> CC-REC-01</div>
                      <div><strong>Process Owner:</strong> General Ledger Controller</div>
                      <div><strong>Version:</strong> 1.2</div>
                      <div><strong>Effective Date:</strong> October 1, 2025</div>
                      <div><strong>Last Updated:</strong> September 2025</div>
                      <div><strong>Frequency:</strong> Monthly</div>
                      <div><strong>Status:</strong> <span className="text-green-600">✅ Active</span></div>
                    </div>
                  </div>
            </div>
              </div>

              <h3 id="purpose" className="text-xl font-semibold text-gray-900 mb-6">Purpose</h3>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                To define the process for reconciling corporate credit card transactions (Brex) with the general ledger, ensuring completeness, accuracy, and compliance with the company's expense recognition and documentation policies.
              </p>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">
                This SOP also establishes the handling of transactions lacking invoices or receipts — including temporary posting to the <strong>Corporate Card Suspense Account (Account 2199)</strong> until proper documentation is received.
              </p>

              <h3 id="scope" className="text-xl font-semibold text-gray-900 mb-6">Scope</h3>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Applies to all business credit card transactions charged on company-issued Brex cards, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2 text-sm leading-relaxed">
                <li>Employee and department-level cards</li>
                <li>Virtual and physical cards</li>
                <li>Subscription and vendor payments made via Brex</li>
              </ul>

              <h3 id="roles" className="text-xl font-semibold text-gray-900 mb-6">Roles & Responsibilities</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Brex Admin</td>
                      <td className="border border-gray-300 px-4 py-2">Download and maintain monthly statements; monitor account feeds.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Accounting Team</td>
                      <td className="border border-gray-300 px-4 py-2">Reconcile Brex feed to GL, validate receipts, and post entries.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Controller</td>
                      <td className="border border-gray-300 px-4 py-2">Review reconciliation results, approve adjusting entries, and sign off.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Cardholders</td>
                      <td className="border border-gray-300 px-4 py-2">Ensure all receipts and transaction details are submitted timely.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="timing" className="text-xl font-semibold text-gray-900 mb-6">Timing</h3>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">
                The reconciliation process must be completed by <strong>the 10th business day</strong> of the month following the statement close.
              </p>

              <h3 id="data-sources" className="text-xl font-semibold text-gray-900 mb-6">Data Sources</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Source</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Brex Dashboard</td>
                      <td className="border border-gray-300 px-4 py-2">Transaction feed, cardholder data, and receipts</td>
                      <td className="border border-gray-300 px-4 py-2">Brex Admin</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Brex Statement (PDF or CSV)</td>
                      <td className="border border-gray-300 px-4 py-2">Official monthly billing statement</td>
                      <td className="border border-gray-300 px-4 py-2">Accounting</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">ERP (NetSuite)</td>
                      <td className="border border-gray-300 px-4 py-2">GL postings and reconciliations</td>
                      <td className="border border-gray-300 px-4 py-2">Accounting</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Aqqrue Expenses</td>
                      <td className="border border-gray-300 px-4 py-2">Receipt and expense submission workflow</td>
                      <td className="border border-gray-300 px-4 py-2">Accounting</td>
                    </tr>
                  </tbody>
                </table>
                </div>

              <h3 id="procedure" className="text-xl font-semibold text-gray-900 mb-6">Procedure</h3>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 1 – Retrieve Statement & Transaction Feed</h4>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-sm leading-relaxed">
                <li>Download the monthly <strong>Brex statement</strong> in PDF and CSV format.</li>
                <li>Export the detailed <strong>transaction feed</strong> (includes merchant, category, and user).</li>
                <li>Verify that all cardholders are active and mapped to cost centers in the ERP.</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 2 – Import and Validate Data</h4>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">
                <li>Import the transaction feed into the <strong>Brex Reconciliation Template (CC-REC-01.xlsx)</strong>.</li>
                <li>Validate that:</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Total per card matches statement total.</li>
                <li>No missing transaction IDs.</li>
                <li>Merchant categories align with company COA mapping.</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 3 – Verify Supporting Documentation</h4>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">
                <li>Cross-check each transaction against the <strong>Aqqrue Expense Module</strong>:</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-3 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Ensure receipt uploaded and business purpose entered.</li>
                <li>Flag any transactions missing receipts or incomplete descriptions.</li>
              </ul>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">Maintain a <strong>Missing Receipt Log</strong> listing:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Cardholder name</li>
                <li>Transaction date and amount</li>
                <li>Merchant</li>
                <li>Follow-up date and responsible approver</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 4 – Record Accounting Entries</h4>
              
              <h5 className="text-base font-semibold text-gray-900 mb-3">(a) For fully supported transactions</h5>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 text-sm leading-relaxed">
                <li>Debit appropriate <strong>expense accounts</strong> (based on department, category, or project).</li>
                <li>Credit <strong>Corporate Credit Card Liability – Brex</strong> (Account 2105).</li>
              </ul>

              <h5 className="text-base font-semibold text-gray-900 mb-3">(b) For transactions missing receipts or invoices</h5>
              <ul className="list-disc list-inside text-gray-700 mb-3 space-y-2 text-sm leading-relaxed">
                <li>Debit <strong>Corporate Card Suspense Account (Account 2199)</strong> temporarily.</li>
                <li>Credit <strong>Corporate Credit Card Liability – Brex (2105)</strong>.</li>
                <li>Update <strong>Suspense Register</strong> with:</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Transaction ID</li>
                <li>Cardholder name</li>
                <li>Amount</li>
                <li>Reason for suspense (e.g., missing invoice)</li>
                <li>Expected resolution date</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm leading-relaxed">
                  ⚠️ <strong>Warning:</strong> Suspense entries should not remain open beyond <strong>30 days</strong> from statement close. Unresolved balances trigger escalation to Controller and potential payroll deduction.
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 5 – Post Monthly Payment</h4>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">
                <li>Once Brex auto-draft payment is confirmed from the bank:</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Debit <strong>Corporate Credit Card Liability – Brex (2105)</strong></li>
                <li>Credit <strong>Cash (Bank Account)</strong></li>
              </ul>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">Verify that the payment matches the statement balance.</p>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 6 – Reconcile Balances</h4>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">Reconcile:</ul>
              <ol className="list-decimal list-inside text-gray-700 mb-3 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Brex statement total → GL liability balance</li>
                <li>GL liability balance → Bank payment</li>
              </ol>
              <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2 text-sm leading-relaxed">
                <li>Investigate any differences &gt; <strong>$100</strong>.</li>
                <li>Document reconciliation results in the <strong>Credit Card Reconciliation Workbook (CC-REC-01.xlsx)</strong>.</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">Step 7 – Clear Suspense Account</h4>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">
                <li>Review open items in the <strong>Suspense Register</strong> weekly.</li>
                <li>When receipts or invoices are later submitted:</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-3 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Reverse the suspense JE:</li>
                <li className="ml-4">Debit <strong>Expense Account</strong></li>
                <li className="ml-4">Credit <strong>Corporate Card Suspense (2199)</strong></li>
              </ul>
              <p className="text-gray-700 mb-8 text-sm leading-relaxed">Maintain a <strong>Suspense Clearance Log</strong> showing movement by month.</p>

              <h3 id="journal-entries" className="text-xl font-semibold text-gray-900 mb-6">Example Journal Entries</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Account</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Debit</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Regular transaction</td>
                      <td className="border border-gray-300 px-3 py-2">SaaS subscription (Zoom)</td>
                      <td className="border border-gray-300 px-3 py-2">6210 Software Subscriptions</td>
                      <td className="border border-gray-300 px-3 py-2">$500</td>
                      <td className="border border-gray-300 px-3 py-2">2105 Brex Card Liability</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Missing receipt</td>
                      <td className="border border-gray-300 px-3 py-2">No invoice for vendor charge</td>
                      <td className="border border-gray-300 px-3 py-2">2199 Suspense – Corporate Card</td>
                      <td className="border border-gray-300 px-3 py-2">$300</td>
                      <td className="border border-gray-300 px-3 py-2">2105 Brex Card Liability</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Reversal (once receipt received)</td>
                      <td className="border border-gray-300 px-3 py-2">Receipt received later</td>
                      <td className="border border-gray-300 px-3 py-2">6210 Software Subscriptions</td>
                      <td className="border border-gray-300 px-3 py-2">$300</td>
                      <td className="border border-gray-300 px-3 py-2">2199 Suspense – Corporate Card</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2">Brex payment</td>
                      <td className="border border-gray-300 px-3 py-2">Payment of statement balance</td>
                      <td className="border border-gray-300 px-3 py-2">2105 Brex Card Liability</td>
                      <td className="border border-gray-300 px-3 py-2">$12,000</td>
                      <td className="border border-gray-300 px-3 py-2">1001 Bank – Checking</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="controls" className="text-xl font-semibold text-gray-900 mb-6">Controls</h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Control ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Frequency</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-CC-05</td>
                      <td className="border border-gray-300 px-4 py-2">Brex feed reconciled to GL monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Accountant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-CC-06</td>
                      <td className="border border-gray-300 px-4 py-2">Missing receipts &gt;30 days escalated to Controller</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Accounting</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-CC-07</td>
                      <td className="border border-gray-300 px-4 py-2">Suspense account reviewed and cleared monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-CC-08</td>
                      <td className="border border-gray-300 px-4 py-2">Reconciliation file signed off by Controller</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">C-CC-09</td>
                      <td className="border border-gray-300 px-4 py-2">Variances &gt;$100 documented and explained</td>
                      <td className="border border-gray-300 px-4 py-2">Monthly</td>
                      <td className="border border-gray-300 px-4 py-2">Accountant</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Evidence of review is maintained in <code className="bg-gray-100 px-2 py-1 rounded">/Finance/Expenses/Brex/Reconciliations/FY25/&lt;Month&gt;/</code>
                    </p>
                  </div>
                </div>
              </div>

              <h3 id="reporting" className="text-xl font-semibold text-gray-900 mb-6">Reporting & Follow-up</h3>
              <ul className="list-disc list-inside text-gray-700 mb-3 text-sm leading-relaxed">Generate <strong>Brex Reconciliation Summary Report</strong> showing:</ul>
              <ul className="list-disc list-inside text-gray-700 mb-6 ml-6 space-y-1 text-sm leading-relaxed">
                <li>Total statement amount</li>
                <li>Posted expenses</li>
                <li>Suspense items count</li>
                <li>% of receipts received on time</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2 text-sm leading-relaxed">
                <li>Share report with Controller and CFO by <strong>Day 12</strong> of close.</li>
                <li>Persistent non-compliance reported to HR (see Credit Card Policy §10).</li>
              </ul>

              <h3 id="escalation" className="text-xl font-semibold text-gray-900 mb-6">Escalation & Exception Handling</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Situation</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Escalation Path</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">SLA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Missing receipt &gt;30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Controller → CFO</td>
                      <td className="border border-gray-300 px-4 py-2">5 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Unreconciled balance &gt;$500</td>
                      <td className="border border-gray-300 px-4 py-2">Controller → CFO</td>
                      <td className="border border-gray-300 px-4 py-2">3 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Unposted Brex feed</td>
                      <td className="border border-gray-300 px-4 py-2">Accountant → Brex Support</td>
                      <td className="border border-gray-300 px-4 py-2">1 business day</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 id="references" className="text-xl font-semibold text-gray-900 mb-6">References</h3>
              <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2 text-sm leading-relaxed">
                <li><strong>POL-AC-02:</strong> Expense Recognition Policy</li>
                <li><strong>POL-CC-01:</strong> Corporate Credit Card Policy</li>
                <li><strong>Template:</strong> CC-REC-01.xlsx (Reconciliation Workbook)</li>
                <li><strong>Register:</strong> CC-SUS-01.xlsx (Suspense Register)</li>
                <li><strong>Automation:</strong> Aqqrue Receipt Reminder Bot #44</li>
              </ul>

              <h3 id="revision" className="text-xl font-semibold text-gray-900 mb-6">Revision History</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Version</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description of Change</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Author</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.0</td>
                      <td className="border border-gray-300 px-4 py-2">Jan 2024</td>
                      <td className="border border-gray-300 px-4 py-2">Initial version</td>
                      <td className="border border-gray-300 px-4 py-2">Finance Ops</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.1</td>
                      <td className="border border-gray-300 px-4 py-2">Mar 2025</td>
                      <td className="border border-gray-300 px-4 py-2">Added suspense account handling</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1.2</td>
                      <td className="border border-gray-300 px-4 py-2">Sep 2025</td>
                      <td className="border border-gray-300 px-4 py-2">Updated timeline and escalation rules</td>
                      <td className="border border-gray-300 px-4 py-2">Controller</td>
                      <td className="border border-gray-300 px-4 py-2">CFO</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">✅ <strong>Status:</strong> Active</p>
                <p className="text-green-800">📅 <strong>Next Review Date:</strong> April 2026</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
};

// Default content for sections that don't have specific workflow content
export const getDefaultContent = (sectionId: string, subSectionId: string) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        {/* Section Header - smaller font */}
        <p className="text-sm font-medium text-blue-600 mb-2">
          {sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
        
        {/* Sub-section Title - large and semi-bold */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {subSectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
        
        {/* Sub-section Description - medium grey */}
        <p className="text-base text-gray-600 mb-6">
            This section contains workflow visualizations for {subSectionId.replace(/-/g, ' ')} within the {sectionId.replace(/-/g, ' ')} process.
          </p>
        
        <div>
            <h3 className="font-semibold text-[var(--primary)] mb-2">Coming Soon</h3>
            <p className="text-sm text-[var(--text)]">
              Interactive workflow visualization for this section is being developed and will be available soon.
            </p>
        </div>
      </div>
    </div>
  );
};