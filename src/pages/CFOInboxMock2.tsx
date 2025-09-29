/** @jsxImportSource react */
import React, { useState, useEffect } from "react";

const CFOInboxMock2 = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const frames = [
    // Frame 1: Task Entry
    {
      type: "chat",
      content: "Reconcile Amazon sales with bank statement",
      response: "Got it. Let's start the reconciliation process."
    },
    // Frame 2: Slack Clarification
    {
      type: "slack",
      content: "Hey Sarah, do you want me to reconcile Sep 1–15 or the full month?",
      response: "Sep 1–15 please.",
      status: "Date range confirmed"
    },
    // Frame 3: Data Fetching
    {
      type: "fetching",
      content: "Fetching data sources…",
      items: [
        "✅ Amazon sales report (Sep 1–15)",
        "✅ Bank statement (Sep 1–15)"
      ]
    },
    // Frame 4: Excel Reconciliation
    {
      type: "excel",
      content: "Reconciling transactions",
      data: [
        { id: "AMZ-001", date: "Sep 1", amazon: "$1,250.00", bank: "$1,250.00", status: "matched" },
        { id: "AMZ-002", date: "Sep 2", amazon: "$890.50", bank: "$890.50", status: "matched" },
        { id: "AMZ-003", date: "Sep 3", amazon: "$2,100.00", bank: "$2,100.00", status: "matched" },
        { id: "AMZ-004", date: "Sep 4", amazon: "$1,450.00", bank: "$1,200.00", status: "exception" },
        { id: "AMZ-005", date: "Sep 5", amazon: "$3,200.00", bank: "", status: "pending" },
        { id: "AMZ-006", date: "Sep 6", amazon: "$750.25", bank: "$750.25", status: "matched" }
      ],
      summary: "2,153 / 2,480 orders reconciled"
    },
    // Frame 5: Contextual Insight
    {
      type: "insight",
      content: "Amazon pays 15 days later → 327 orders not reconciled yet",
      icon: "🕒"
    },
    // Frame 6: Exceptions
    {
      type: "exceptions",
      content: "Exceptions found",
      items: [
        "🚩 Amazon overcharged fees — $4.3K variance",
        "🚩 Payments missing — 2 orders"
      ]
    },
    // Frame 7: Escalation
    {
      type: "escalation",
      content: "Exceptions sent to Controller (Slack + Email)",
      link: "Link to workpaper displayed"
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentFrame(0);
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= frames.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const nextFrame = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const prevFrame = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  const renderFrame = () => {
    const frame = frames[currentFrame];
    
    switch (frame.type) {
      case "chat":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="/mobius-logo.png" alt="Aqqrue" className="w-8 h-8" />
                <h2 className="text-xl font-bold">Aqqrue Agent</h2>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-200">💬 "{frame.content}"</p>
              </div>
              <div className="bg-cyan-500/20 rounded-lg p-4">
                <p className="text-sm text-cyan-300">🤖 "{frame.response}"</p>
              </div>
            </div>
          </div>
        );

      case "slack":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logos/slack-logo-icon.png" alt="Slack" className="w-8 h-8" />
                <h2 className="text-xl font-bold">Slack Clarification</h2>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-200">💬 "{frame.content}"</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-300">✅ "{frame.response}"</p>
              </div>
              <div className="bg-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-emerald-300">{frame.status}</p>
              </div>
            </div>
          </div>
        );

      case "fetching":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="/mobius-logo.png" alt="Aqqrue" className="w-8 h-8" />
                <h2 className="text-xl font-bold">Data Collection</h2>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <p className="text-sm text-slate-200 mb-4">📥 {frame.content}</p>
                <div className="space-y-2">
                  {frame.items.map((item, index) => (
                    <div key={index} className="text-sm text-green-300">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "excel":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img src="/mobius-logo.png" alt="Aqqrue" className="w-8 h-8" />
                <h2 className="text-xl font-bold">Reconciliation Workpaper</h2>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 overflow-x-auto">
                <div className="min-w-[600px]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-2 text-slate-300">Order ID</th>
                        <th className="text-left p-2 text-slate-300">Date</th>
                        <th className="text-left p-2 text-slate-300">Amount (Amazon)</th>
                        <th className="text-left p-2 text-slate-300">Amount (Bank)</th>
                        <th className="text-left p-2 text-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frame.data.map((row, index) => (
                        <tr 
                          key={index} 
                          className={`border-b border-slate-700/50 ${
                            row.status === 'matched' ? 'bg-green-500/10' : 
                            row.status === 'exception' ? 'bg-red-500/10' : 
                            'bg-yellow-500/10'
                          }`}
                        >
                          <td className="p-2 text-slate-200">{row.id}</td>
                          <td className="p-2 text-slate-200">{row.date}</td>
                          <td className="p-2 text-slate-200">{row.amazon}</td>
                          <td className="p-2 text-slate-200">{row.bank}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              row.status === 'matched' ? 'bg-green-500/20 text-green-300' :
                              row.status === 'exception' ? 'bg-red-500/20 text-red-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <p className="text-sm text-cyan-300">⚖️ {frame.content} — {frame.summary}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "insight":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{frame.icon}</span>
                <h2 className="text-xl font-bold">Contextual Insight</h2>
              </div>
              <div className="bg-amber-500/20 rounded-lg p-6">
                <p className="text-lg text-amber-300">{frame.content}</p>
              </div>
            </div>
          </div>
        );

      case "exceptions":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🚩</span>
                <h2 className="text-xl font-bold">Exception Analysis</h2>
              </div>
              <div className="bg-red-500/20 rounded-lg p-6">
                <p className="text-lg text-red-300 mb-4">{frame.content}</p>
                <div className="space-y-2">
                  {frame.items.map((item, index) => (
                    <div key={index} className="text-sm text-red-200">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "escalation":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 text-white border border-cyan-500/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📤</span>
                <h2 className="text-xl font-bold">Escalation</h2>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-6">
                <p className="text-lg text-blue-300 mb-4">{frame.content}</p>
                <div className="bg-slate-800/60 rounded-lg p-3">
                  <p className="text-sm text-slate-300">{frame.link}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <div className="relative min-h-screen bg-transparent flex items-center justify-center">

      {/* Main Content Container */}
      <div className="flex items-center justify-center w-full max-w-7xl px-8 relative">
        
        {/* Frame Display */}
        <div className="w-full max-w-4xl">
          {renderFrame()}
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={startDemo}
            disabled={isPlaying}
            className="bg-cyan-500/20 text-[#22D3EE] px-4 py-2 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? 'Playing...' : 'Start Demo'}
          </button>
          <button
            onClick={prevFrame}
            disabled={currentFrame === 0}
            className="bg-slate-700/50 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={nextFrame}
            disabled={currentFrame === frames.length - 1}
            className="bg-cyan-500/20 text-[#22D3EE] px-4 py-2 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 left-4">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/10">
            <p className="text-xs text-slate-300 mb-2">Frame {currentFrame + 1} of {frames.length}</p>
            <div className="flex gap-1">
              {frames.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentFrame ? 'bg-cyan-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box - Always visible */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="w-full max-w-3xl px-6">
          <div className="bg-gradient-to-br from-[#16222E] to-[#1F2B3A] backdrop-blur-lg border-t-2 border-cyan-500/40 rounded-2xl shadow-[0_-2px_20px_rgba(6,182,212,0.15),0_0_0_1px_rgba(6,182,212,0.1)] p-4 flex items-center gap-3 hover:border-cyan-500/50 transition-colors duration-300">
            
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <img src="/mobius-logo.png" alt="Aqqrue" className="w-4 h-4" />
            </div>
            
            {/* Question */}
            <p className="flex-1 text-sm text-slate-200">
              {currentFrame === 0 ? "Reconcile Amazon sales with bank statement" : "Task in progress..."}
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

export default CFOInboxMock2;
