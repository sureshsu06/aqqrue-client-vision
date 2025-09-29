/** @jsxImportSource react */
import React from "react";

const CFOInboxMock = () => {
  return (
    <>
    <div className="relative min-h-screen bg-transparent flex items-center justify-center">

      {/* Main Content Container */}
      <div className="flex items-center justify-center w-full max-w-7xl px-8 relative">
        {/* Mock Inbox Panel */}
         <div className="w-[700px] bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-6 text-white mr-16 border border-cyan-500/10">
          
          {/* Section: Overdue */}
          <div className="mb-6">
            <h2 className="text-[#A0AEC0] text-sm mb-3 font-medium tracking-wide uppercase">OVERDUE</h2>
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-sm rounded-xl p-4 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/30 bg-gradient-to-r from-slate-800/80 to-cyan-900/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
                  <img src="/logos/brex.png" alt="Brex" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1 text-base">Receivables overdue: $3.2M across 12 customers</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A0AEC0] text-sm">Risk: &gt;45 days DSO, top 2 = 65% exposure</span>
                    <span className="bg-red-500/20 text-[#F87171] text-xs px-2 py-1 rounded-full">Critical</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">US Inc.</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
                  <img src="/logos/data-sources/hubspot-logo-png_seeklogo-506857.png" alt="HubSpot" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1 text-base">Invoice past due: $320K from Acme Corp</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A0AEC0] text-sm">Risk: -$300K cash</span>
                    <span className="bg-orange-500/20 text-[#FBBF24] text-xs px-2 py-1 rounded-full">45 days overdue</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">US Inc.</span>
                </div>
              </div>
            </div>
            
            {/* Truncated items indicator */}
            <div className="bg-gradient-to-br from-[#16222E]/60 to-[#1F2B3A]/40 backdrop-blur-sm rounded-xl p-3 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                <span className="text-xs text-slate-500">+3 more overdue items</span>
              </div>
            </div>
          </div>

          {/* Section: This Week */}
          <div className="mb-6">
            <h2 className="text-[#A0AEC0] text-sm mb-3 font-medium tracking-wide uppercase">THIS WEEK</h2>
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
                  <img src="/logos/data-sources/aws.png" alt="AWS" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1 text-base">AWS cost spike: +22% vs last week</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A0AEC0] text-sm">Risk: -$95K gross margin</span>
                    <span className="bg-yellow-500/20 text-[#FBBF24] text-xs px-2 py-1 rounded-full">Due in 7d</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">US Inc.</span>
                </div>
              </div>
            </div>
            
            {/* Truncated items indicator */}
            <div className="bg-gradient-to-br from-[#16222E]/60 to-[#1F2B3A]/40 backdrop-blur-sm rounded-xl p-3 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                <span className="text-xs text-slate-500">+5 more this week</span>
              </div>
            </div>
          </div>

          {/* Section: Next 30 Days */}
          <div>
            <h2 className="text-[#A0AEC0] text-sm mb-3 font-medium tracking-wide uppercase">NEXT 30 DAYS</h2>
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
                  <img src="/logos/data-sources/hubspot-logo-png_seeklogo-506857.png" alt="HubSpot" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1 text-base">Large renewal due: $420K ARR</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#A0AEC0] text-sm">Due in 14d</span>
                    <span className="bg-cyan-500/20 text-[#22D3EE] text-xs px-2 py-1 rounded-full">Potential churn risk</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">US Inc.</span>
                </div>
              </div>
            </div>
            
            {/* Truncated items indicator */}
            <div className="bg-gradient-to-br from-[#16222E]/60 to-[#1F2B3A]/40 backdrop-blur-sm rounded-xl p-3 shadow-[0_0_20px_rgba(6,182,212,0.12)] border border-cyan-500/10">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                <span className="text-xs text-slate-500">+7 more upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Panel - AI Brain */}
         <div className="w-[400px] bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-6 text-white relative">
          
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-4">
            <img src="/mobius-logo.png" alt="Aqqrue" className="w-6 h-6" />
            <h3 className="font-bold text-white text-base">Overdue Receivables</h3>
          </div>
          
          {/* Executive Summary */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#22D3EE] mb-2">Executive Summary</h4>
            <p className="text-xs text-[#A0AEC0] leading-relaxed">
              $3.2M in receivables are overdue &gt;45 days across 12 customers. Top 2 customers account for 65% of exposure. Last communication from Acme Corp (25 days ago) and Beta Ltd (40 days ago)...
            </p>
          </div>

          {/* Details Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#A0AEC0] mb-2">Details</h4>
            <div className="bg-gradient-to-br from-[#16222E]/60 to-[#1F2B3A]/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/10">
              <p className="text-xs text-[#A0AEC0] leading-relaxed mb-2">
                Acme Corp ($1.1M) and Beta Ltd ($950K) represent 65% of total exposure. Both customers have historically paid on time but are now 60+ days overdue with no response to standard collection efforts.
              </p>
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-600/30">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <span className="text-xs text-slate-500 ml-2">+8 more details</span>
              </div>
            </div>
          </div>
          
          {/* Communication Snippets */}
          <div className="space-y-3 mb-4">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-slate-700/50 rounded flex items-center justify-center p-1">
                    <img src="/logos/Gmail_icon_(2020).svg.webp" alt="Email" className="h-3 w-auto" />
                  </div>
                  <span className="text-xs text-[#A0AEC0]">Email • Acme Corp</span>
                </div>
                <span className="text-xs text-[#F87171]">25 days ago</span>
              </div>
              <p className="text-xs text-[#A0AEC0]">
                "We're experiencing cash flow challenges and need to extend payment terms to 90 days..."
              </p>
            </div>
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-slate-700/50 rounded flex items-center justify-center p-1">
                    <img src="/logos/slack-logo-icon.png" alt="Slack" className="h-3 w-auto" />
                  </div>
                  <span className="text-xs text-[#A0AEC0]">Slack • Beta Ltd</span>
                </div>
                <span className="text-xs text-[#F87171]">40 days ago</span>
              </div>
              <p className="text-xs text-[#A0AEC0]">
                "Payment team: We're restructuring our AP process. All invoices over $500K need additional approval..."
              </p>
            </div>
          </div>

          {/* AI Recommendations - Star Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#22D3EE] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              AI Recommendation
            </h4>
            <div className="bg-cyan-500/15 border border-cyan-400/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <span className="text-xs text-slate-500 ml-2">+3 recommendations</span>
              </div>
            </div>
          </div>
        </div>

                   {/* Top Right Diagonal Overlay Card - Policy-Aware Decisions */}
                   <div className="absolute top-4 right-[-80px] w-64 bg-gradient-to-br from-[#16222E]/70 to-[#1F2B3A]/60 backdrop-blur-lg rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.12)] p-4 text-white border border-cyan-400/20 transform rotate-2 hover:rotate-0 transition-transform duration-300 opacity-80">
          <h4 className="text-sm font-semibold text-white mb-2">Policy-Aware Decisions</h4>
          <div className="bg-gradient-to-br from-[#16222E]/40 to-[#1F2B3A]/30 rounded-lg p-3 border border-cyan-500/10 space-y-2">
            <p className="text-xs text-[#A0AEC0] mb-2 font-medium">Currently Applied:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <p className="text-xs text-blue-300 leading-relaxed flex-1">
                   Prepaid Expenses &gt; $5K
                 </p>
                <div className="relative ml-3">
                  <input type="checkbox" id="policy-toggle-1" className="sr-only" defaultChecked />
                  <label htmlFor="policy-toggle-1" className="flex items-center cursor-pointer">
                    <div className="w-6 h-3 bg-blue-500 rounded-full p-0.5 transition-colors duration-200">
                      <div className="w-2 h-2 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-3"></div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                 <p className="text-xs text-blue-300 leading-relaxed flex-1">
                   Capitalize Assets &gt; $10K
                 </p>
                <div className="relative ml-3">
                  <input type="checkbox" id="policy-toggle-2" className="sr-only" defaultChecked />
                  <label htmlFor="policy-toggle-2" className="flex items-center cursor-pointer">
                    <div className="w-6 h-3 bg-blue-500 rounded-full p-0.5 transition-colors duration-200">
                      <div className="w-2 h-2 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-3"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

           {/* Bottom Right Diagonal Overlay Card - Internal Controls */}
           <div className="absolute bottom-4 right-[-80px] w-64 bg-gradient-to-br from-[#16222E]/70 to-[#1F2B3A]/60 backdrop-blur-lg rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.12)] p-4 text-white border border-cyan-400/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300 opacity-80">
          <h4 className="text-sm font-semibold text-white mb-2">Internal Controls</h4>
          <div className="bg-gradient-to-br from-[#16222E]/40 to-[#1F2B3A]/30 rounded-lg p-3 border border-cyan-500/10 space-y-2">
            <p className="text-xs text-[#A0AEC0] mb-2 font-medium">Active Rules:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-emerald-300 leading-relaxed flex-1">
                  PO-to-invoice auto-match
                </p>
                <div className="relative ml-3">
                  <input type="checkbox" id="workflow-toggle-1" className="sr-only" defaultChecked />
                  <label htmlFor="workflow-toggle-1" className="flex items-center cursor-pointer">
                    <div className="w-6 h-3 bg-emerald-500 rounded-full p-0.5 transition-colors duration-200">
                      <div className="w-2 h-2 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-3"></div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-emerald-300 leading-relaxed flex-1">
                  Receipt enforcement for corp cards
                </p>
                <div className="relative ml-3">
                  <input type="checkbox" id="workflow-toggle-2" className="sr-only" defaultChecked />
                  <label htmlFor="workflow-toggle-2" className="flex items-center cursor-pointer">
                    <div className="w-6 h-3 bg-emerald-500 rounded-full p-0.5 transition-colors duration-200">
                      <div className="w-2 h-2 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-3"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* Bottom Left Diagonal Overlay Card - Q3 Forecast */}
         <div className="absolute bottom-4 left-[-80px] w-64 bg-gradient-to-br from-[#16222E]/70 to-[#1F2B3A]/60 backdrop-blur-lg rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.12)] p-4 text-white border border-cyan-400/20 transform rotate-2 hover:rotate-0 transition-transform duration-300 opacity-80">
          <h4 className="text-sm font-semibold text-white mb-2">Q3 Forecast</h4>
          <div className="bg-gradient-to-br from-[#16222E]/40 to-[#1F2B3A]/30 rounded-lg p-3 border border-cyan-500/10">
            <p className="text-xs text-[#A0AEC0] mb-2 font-medium">Impact Analysis:</p>
            <p className="text-xs text-orange-300 leading-relaxed">
              Will impact 20% of Q3 renewal ARR
            </p>
          </div>
        </div>
      </div> {/* closes main content container */}

      {/* Background Glow Effect - Removed for transparency */}

      {/* Chat Box */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="w-full max-w-3xl px-6">
          <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg border-t-2 border-cyan-500/40 rounded-2xl shadow-[0_-2px_20px_rgba(6,182,212,0.15),0_0_0_1px_rgba(6,182,212,0.1)] p-4 flex items-center gap-3 hover:border-cyan-500/50 transition-colors duration-300">
            
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <img src="/mobius-logo.png" alt="Aqqrue" className="w-4 h-4" />
            </div>
            
            {/* Question */}
            <p className="flex-1 text-sm text-slate-200">
              How are we doing against the Apr plan on G&amp;A expenses?
            </p>
            
            {/* Send button */}
            <button className="bg-cyan-500/20 text-[#22D3EE] px-3 py-1 rounded-lg text-xs hover:bg-cyan-500/30 transition-colors duration-200">
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CFOInboxMock;
