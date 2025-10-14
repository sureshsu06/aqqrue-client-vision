import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Updated: cleaned stacking, removed heavy sweep background, tuned positions & z-indexes.

const TYPING_TEXT = 'Reconcile Amazon sales with bank receipts';

function TypingBubble({ onDone }: { onDone?: () => void }) {
  const [text, setText] = useState('');
  useEffect(() => {
    let i = 0;
    const t = window.setInterval(() => {
      setText(TYPING_TEXT.slice(0, i));
      i += 1;
      if (i > TYPING_TEXT.length) {
        clearInterval(t);
        setTimeout(() => onDone && onDone(), 450);
      }
    }, 35);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div className="w-full flex justify-center items-end pb-8 z-40">
      <div className="w-[min(780px,92%)] max-w-full">
        <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-md p-4">
          <div className="text-sm text-slate-500 mb-2">You</div>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-3 text-gray-900 dark:text-gray-50 text-base">
            {text}
            <span className="inline-block w-1 h-5 align-middle bg-slate-800 dark:bg-white ml-1 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubtasksCard({ visible, assignedTo = 'Aqqrue', stage, completedTasks = new Set() }: { visible: boolean; assignedTo?: string; stage: number; completedTasks?: Set<number> }) {
  const items = [
    'Clarify date range',
    'Obtain Amazon report',
    'Obtain bank report',
    'Perform recon',
    'Flag exceptions',
  ];

  // Determine if we should show the compact version (after all bullets appear + Slack appears)
  // All 5 bullets take: 0 + 0.4 + 0.8 + 1.2 + 1.6 = 4 seconds total
  // So we wait until stage 3 AND enough time has passed for all bullets
  const isCompact = stage >= 4;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 8, opacity: 0, scale: 0.995 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: isCompact ? 0.8 : 1,
            x: isCompact ? 0 : 0
          }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.1, 0.25, 1],
            scale: { duration: 1.0, ease: "easeOut" }
          }}
          className={`absolute z-30 ${isCompact ? 'right-4 top-4' : 'left-1/2 -translate-x-1/2 top-20'}`}
          aria-hidden={!visible}
        >
          <div
            className={`bg-white rounded-2xl shadow-lg px-5 py-4 ${isCompact ? 'max-w-[700px] w-[700px]' : 'max-w-[720px] w-[min(720px,92%)]'}`}
            role="region"
            aria-label="Subtasks created"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-semibold text-slate-700 leading-tight">Subtasks created</div>
                <div className="text-xs text-slate-400 mt-1">Automated split by Aqqrue</div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <img 
                  src="/mobius-logo.png" 
                  alt="Aqqrue logo" 
                  className="w-6 h-6 object-contain"
                />
                <div className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Aqqrue</div>
              </div>
            </div>

            <div
              className={`flex gap-3 ${isCompact ? 'flex-row' : 'flex-col'}`}
              role="list"
              aria-label="Subtask list"
            >
              {items.map((it, i) => (
                <motion.div
                  key={it}
                  role="listitem"
                  className={`flex items-center gap-3 break-words ${isCompact ? 'min-h-[24px]' : 'min-h-[36px]'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.3,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <div
                    className={`flex-none rounded-full flex items-center justify-center text-sm font-medium ${isCompact ? 'w-6 h-6' : 'w-7 h-7'} ${
                      completedTasks.has(i) 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    {completedTasks.has(i) ? '✓' : i + 1}
                </div>
                  <div className={`leading-snug ${isCompact ? 'text-xs' : 'text-sm'} ${
                    completedTasks.has(i) 
                      ? 'text-green-700 line-through' 
                      : 'text-slate-700'
                  }`}>{it}</div>
                </motion.div>
              ))}
            </div>

            {/* subtle divider & footer row for tiny help text */}
            {!isCompact && (
              <div className="mt-4 border-t pt-3 border-slate-100">
                <div className="text-xs text-slate-400">Need to change assignment? Click the task to reassign or add a comment.</div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Slack-like threaded peek (drop-in replacement for SlackPeek)
// Usage: <SlackPeek visible={stage >= 3} />

function SlackPeek({ visible, stage, onComplete }: { visible: boolean; stage: number; onComplete?: () => void }) {
  const exchange = [
    { id: 'a1', who: 'Aqqrue', text: 'I need to clarify the date range for the Amazon reconciliation. What period should I analyze?', time: 'Now', fromBot: true },
    { id: 'u1', who: 'Kevin', text: 'Please analyze August 1-31, 2025 for the Amazon sales data.', time: 'Now', fromBot: false },
    { id: 'a2', who: 'Aqqrue', text: 'Perfect! I\'ll pull the Amazon sales data for Aug 1-31 and match it with bank receipts for the same period.', time: 'Now', fromBot: true },
  ];

  const [shown, setShown] = React.useState<number>(0);
  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

  useEffect(() => {
    if (!visible) {
      setShown(0);
      setIsMinimized(false);
      return;
    }
    // reveal messages one-by-one
    let timers: number[] = [];
    exchange.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setShown((s) => Math.max(s, i + 1));
        }, 1500 + i * 1000)
      );
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [visible]);

  // Minimize after all messages are shown and stage progresses
  useEffect(() => {
    if (visible && shown === exchange.length && stage >= 5) {
      const timer = setTimeout(() => {
        setIsMinimized(true);
        // Call onComplete callback when Slack flow is done
        if (onComplete) {
          onComplete();
        }
        setTimeout(() => {
          // Hide completely after minimize animation
        }, 500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visible, shown, stage, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: isMinimized ? 0 : 1,
            scale: isMinimized ? 0.3 : 1,
            y: isMinimized ? -20 : 0
          }}
          exit={{ x: 30, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute right-20 top-40 w-[360px] z-36"
          aria-hidden={!visible}
        >
          <div className="bg-white rounded-xl shadow-lg p-0 overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#350d36] border-b border-[#350d36]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-[#611f69] text-white flex items-center justify-center font-semibold text-sm">A</div>
                <div>
                  <div className="text-sm font-semibold text-white">#accounts</div>
                  <div className="text-xs text-slate-200/80">Slack · channel</div>
                </div>
              </div>
              <div className="text-xs text-slate-200/70">online</div>
            </div>

            {/* Messages list */}
            <div 
              ref={(el) => {
                if (el) {
                  if (shown === 1) {
                    // Start at top for first message
                    el.scrollTop = 0;
                  } else if (shown > 2) {
                    // Auto-scroll only when 3rd message appears
                    el.scrollTop = el.scrollHeight;
                  }
                }
              }}
              className="p-3 space-y-4 max-h-[220px] overflow-y-auto bg-white"
            >
              {exchange.map((m, i) => {
                const isShown = i < shown;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isShown ? { opacity: 1, y: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: isShown ? 0 : 0 }}
                    className={`flex ${m.fromBot ? 'justify-start' : 'justify-start'}`}
                  >
                    <div className="flex items-start gap-3 max-w-[92%]">
                       <div className="flex-none">
                         <div className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center overflow-hidden ${m.fromBot ? 'bg-[#E9D5FF] text-[#4C0078]' : 'bg-slate-100 text-slate-600'}`}>
                           {m.fromBot ? (
                             <img src="/mobius-logo.png" alt="Aqqrue" className="w-6 h-6 object-contain" />
                           ) : m.who === 'Kevin' ? (
                             <img src="/pirate_1010047.png" alt="Kevin" className="w-8 h-8 object-cover rounded-full" />
                           ) : 'A'}
                         </div>
                       </div>
                       <div>
                         <div className="text-xs text-slate-500">{m.who}</div>
                         <div className={`mt-1 inline-block rounded-lg px-3 py-2 text-sm shadow-sm ${m.fromBot ? 'bg-[#EDE0FF] text-[#3B0066]' : 'bg-slate-100 text-slate-700'}`}>
                          {isShown ? (
                            m.text
                          ) : (
                            <span className="inline-flex gap-1 items-center">
                              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-75" />
                              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{m.time}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input area (static visual) */}
            <div className="px-3 py-2 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 text-sm rounded-md border border-slate-100 px-3 py-2 focus:outline-none"
                  placeholder="Message #accounts"
                  readOnly
                />
                 <button className="px-3 py-1 rounded bg-[#4A154B] text-white text-sm shadow-sm">Send</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DataPane({ title, rows, left }: { title: string; rows: any[]; left?: boolean }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`bg-white rounded-xl shadow p-3 w-[min(360px,44%)] ${left ? 'mr-2' : 'ml-2'} z-32`}
    >
      <div className="text-xs text-slate-400 mb-2">{title}</div>
      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-left text-[12px] text-slate-500">
            <th>date</th>
            <th>ref</th>
            <th className="text-right">amt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`${r.state === 'matched' ? 'bg-green-50' : r.state === 'exception' ? 'bg-red-50' : ''}`}>
              <td className="py-2 text-[13px]">{r.date}</td>
              <td className="py-2 text-[13px]">{r.ref}</td>
              <td className="py-2 text-right text-[13px]">{r.amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function AgentDownloadScreen({ visible, onComplete }: { visible: boolean; onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(0); // 0=login, 1=dashboard, 2=sales
  const [amazonDownloaded, setAmazonDownloaded] = useState(false);
  const [bankDownloaded, setBankDownloaded] = useState(false);

  const amazonScreens = [
    { src: "/Amazon-Login.png", alt: "Amazon Login" },
    { src: "/Amazon Dashboard.png", alt: "Amazon Dashboard" },
    { src: "/Amazon Sales.png", alt: "Amazon Sales Dashboard" }
  ];

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setCurrentScreen(0);
      setAmazonDownloaded(false);
      setBankDownloaded(false);
      return;
    }

    // Step progression: 
    // 0=login screen, 1=navigate to dashboard, 2=dashboard screen, 3=navigate to sales, 4=sales screen, 5=download amazon, 6=download bank, 7=complete
    const t1 = setTimeout(() => {
      console.log('Setting step 1 - navigate to dashboard');
      setCurrentStep(1);
    }, 2000); // Navigate to dashboard
    const t2 = setTimeout(() => {
      console.log('Setting step 2 and screen 1 - show dashboard');
      setCurrentStep(2);
      setCurrentScreen(1);
    }, 4000); // Show dashboard
    const t3 = setTimeout(() => {
      console.log('Setting step 3 - navigate to sales');
      setCurrentStep(3);
    }, 6000); // Navigate to sales
    const t4 = setTimeout(() => {
      console.log('Setting step 4 and screen 2 - show sales dashboard');
      setCurrentStep(4);
      setCurrentScreen(2);
    }, 8000); // Show sales dashboard
    const t5 = setTimeout(() => {
      console.log('Setting step 5 - download amazon');
      setCurrentStep(5);
    }, 10000); // Download Amazon - cursor appears
    const t6 = setTimeout(() => {
      console.log('Amazon downloaded');
      setAmazonDownloaded(true);
    }, 14000); // 4 seconds for cursor movement and clicking
    const t7 = setTimeout(() => {
      console.log('Setting step 6 - download bank');
      setCurrentStep(6);
    }, 15000); // Download Bank
    const t8 = setTimeout(() => {
      console.log('Bank downloaded');
      setBankDownloaded(true);
    }, 18000);
    const t9 = setTimeout(() => {
      console.log('Setting step 7 - complete');
      setCurrentStep(7);
      if (onComplete) onComplete();
    }, 20000);

    return () => [t1, t2, t3, t4, t5, t6, t7, t8, t9].forEach(clearTimeout);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-1/4 -translate-x-1/2 top-1/4 -translate-y-1/2 w-[500px] h-[400px] z-35"
        >
          {/* Real Amazon Seller Central Interface */}
          <div className="w-full h-full rounded-lg shadow-2xl overflow-hidden relative">
            {/* Debug info */}
            <div className="absolute top-2 left-2 bg-black text-white p-2 text-xs z-50">
              Step: {currentStep}, Screen: {currentScreen}
            </div>
            
            {/* Use the dynamic Amazon screen based on current step */}
            <img 
              src={amazonScreens[currentScreen].src}
              alt={amazonScreens[currentScreen].alt}
              className="w-full h-full object-contain"
            />
            
            {/* Overlay for download button interaction - only on sales screen */}
            {currentScreen === 2 && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Download button area - positioned over the actual download button */}
                <div className="absolute top-4 right-4 w-20 h-8">
                  <motion.button
                    className={`w-full h-full rounded text-white text-sm font-medium transition-all duration-300 ${
                      currentStep >= 5 ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    animate={currentStep >= 5 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {amazonDownloaded ? '✓ Downloaded' : 'Download'}
                  </motion.button>
                </div>
                
                {/* Aqqrue cursor/pointer - only on sales screen when downloading */}
                {currentStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, x: -100, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: 0,
                      y: 0
                    }}
                    transition={{ 
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                    className="absolute top-6 right-6 w-8 h-8 pointer-events-none"
                  >
                    <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Aqqrue
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Aqqrue Agent Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">
              <img src="/mobius-logo.png" alt="Aqqrue" className="w-5 h-5 object-contain" />
              <span>
                {currentStep === 0 && "Aqqrue is logging into Amazon Seller Central..."}
                {currentStep === 1 && "Aqqrue is navigating to Dashboard..."}
                {currentStep === 2 && "Aqqrue is viewing the Dashboard..."}
                {currentStep === 3 && "Aqqrue is navigating to Sales Reports..."}
                {currentStep === 4 && "Aqqrue is viewing the Sales Dashboard..."}
                {currentStep === 5 && "Aqqrue is downloading Amazon sales report..."}
                {currentStep === 6 && "Aqqrue is downloading bank receipts..."}
                {currentStep === 7 && "Aqqrue has completed downloading reports!"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SweepConnector({ progress }: { progress: number }) {
  // subtle sweep: thin stroke, behind panes
  return (
    <svg className="absolute left-1/2 -translate-x-1/2 top-48 w-[min(760px,90vw)] pointer-events-none z-16" height="100" viewBox="0 0 760 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#f6d365" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fda085" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M40 30 C 200 70, 560 70, 720 30`}
        strokeWidth={4}
        strokeLinecap="round"
        stroke="url(#g1)"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function AqqrueReconGifDemo() {
  const [stage, setStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  // stages: 0 = idle typing, 1=assigning, 2=subtasks, 3=slack, 4=download, 5=data, 6=running, 7=exceptions, 8=summary
  useEffect(() => {
    if (isPaused) return;
    
    let timers: number[] = [];
    if (stage === 0) return;
    if (stage === 1) {
      timers.push(window.setTimeout(() => setStage(2), 650));
    }
    if (stage === 2) {
      // Wait for all subtasks bullets to finish (5 bullets * 400ms delay = 2 seconds) + buffer
      timers.push(window.setTimeout(() => setStage(3), 1000 + 500));
    }
    if (stage === 3) {
      // Wait for horizontal transition to complete (1.0s) before starting Slack
      // Add extra buffer to ensure transition is fully complete
      timers.push(window.setTimeout(() => setStage(4), 3000));
    }
     if (stage === 4) {
       // Wait for all Slack messages to complete (3 messages * 1000ms delay + 1500ms initial + buffer)
       timers.push(window.setTimeout(() => setStage(5), 1500 + (3 * 1000) + 500));
     }
     if (stage === 5) {
       // Wait for download screen to complete (20 seconds total for multi-screen flow)
       timers.push(window.setTimeout(() => setStage(6), 21000));
     }
     if (stage === 6) {
       // Wait a bit before starting data panes (after downloads are complete)
       timers.push(window.setTimeout(() => setStage(7), 1000));
     }
     if (stage === 7) timers.push(window.setTimeout(() => setStage(8), 1200));
     if (stage === 8) timers.push(window.setTimeout(() => setStage(9), 900));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [stage, isPaused]);

  const [sweepProgress, setSweepProgress] = useState(0);
  useEffect(() => {
    if (stage === 8 && !isPaused) {
      setSweepProgress(0.03);
      const t1 = window.setTimeout(() => setSweepProgress(0.6), 250);
      const t2 = window.setTimeout(() => setSweepProgress(1), 700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage, isPaused]);

  const amazonRows = [
    { date: '2025-08-03', ref: 'AMZ-1001', amt: '₹1,200.00', state: stage >= 8 ? 'matched' : 'pending' },
    { date: '2025-08-04', ref: 'AMZ-1002', amt: '₹3,500.00', state: stage >= 9 ? 'exception' : stage >= 8 ? 'matched' : 'pending' },
    { date: '2025-08-05', ref: 'AMZ-1003', amt: '₹2,150.00', state: stage >= 8 ? 'matched' : 'pending' },
  ];

  const bankRows = [
    { date: '2025-08-03', ref: 'BANK-9001', amt: '₹1,200.00', state: stage >= 8 ? 'matched' : 'pending' },
    { date: '2025-08-05', ref: 'BANK-9003', amt: '₹2,150.00', state: stage >= 8 ? 'matched' : 'pending' },
    { date: '2025-08-06', ref: 'BANK-9004', amt: '₹5,000.00', state: stage >= 9 ? 'exception' : 'pending' },
  ];

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-slate-900">
      <div
        className="relative w-full h-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl overflow-hidden"
        role="img"
        aria-label="Demo: Aqqrue reconciliation workflow"
      >
        {/* Header area (product chrome) */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between z-40 bg-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">A</div>
            <div className="text-sm font-semibold">Aqqrue — Tasks</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          <div className="text-xs text-slate-400">Audit-ready • demo • Stage: {stage}</div>
          </div>
        </div>

        {/* Agent download screen - positioned relative to full screen */}
        <AgentDownloadScreen 
          visible={stage === 5} 
          onComplete={() => setCompletedTasks(prev => new Set([...prev, 1, 2]))} 
        />

        {/* Main canvas area */}
        <div className="relative px-6 pt-10 pb-28 h-full">
          <SubtasksCard visible={stage >= 2} stage={stage} completedTasks={completedTasks} />

           <SlackPeek 
             visible={stage >= 4} 
             stage={stage} 
             onComplete={() => setCompletedTasks(prev => new Set([...prev, 0]))} 
           />

           {/* data panes centered horizontally, slightly above midline */}
           <div className="absolute left-1/2 -translate-x-1/2 top-48 flex gap-4 justify-center w-full max-w-4xl z-32">
             {stage >= 7 && <DataPane title={'Amazon report (CSV)'} rows={amazonRows} left />}
             {stage >= 7 && <DataPane title={'Bank receipts (CSV)'} rows={bankRows} />}
          </div>

          {/* sweep connector: behind panes */}
          {stage >= 8 && <SweepConnector progress={sweepProgress} />}

          {/* exceptions */}
          <AnimatePresence>
            {stage >= 8 && (
              <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-10 top-56 w-[300px] z-26">
                <div className="bg-white rounded-xl shadow p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">Exceptions</div>
                    <div className="text-xs text-slate-400">3 items</div>
                  </div>
                  <div className="text-[13px] text-slate-600">AMZ-1002 — possible refund mismatch</div>
                  <div className="mt-2 text-[13px] text-slate-600">BANK-9004 — unmatched bank deposit</div>
                  <div className="mt-3 flex gap-2">
                    <button className="text-sm px-3 py-1 rounded bg-amber-100">Ask for clarification</button>
                    <button className="text-sm px-3 py-1 rounded border">Open exceptions</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* summary */}
          <AnimatePresence>
            {stage >= 9 && (
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute right-8 top-56 w-[300px] z-30">
                <div className="bg-white rounded-xl shadow p-4 text-sm">
                  <div className="font-semibold">Reconciliation complete</div>
                  <div className="text-slate-500 text-xs mt-1">97% matched • 3 exceptions</div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">View report</button>
                    <button className="px-3 py-1 rounded border text-sm">Open exceptions</button>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">Audit trail • Created by Aqqrue</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* bottom chat area (always on top) */}
        <div className="absolute bottom-0 left-0 right-0 z-40">
          {stage === 0 && <TypingBubble onDone={() => setStage(1)} />}
          {stage > 0 && (
            <div className="w-full flex justify-center items-end pb-6">
              <div className="w-[min(780px,92%)] max-w-full">
                <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-md p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">You</div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-3 text-base text-gray-900 dark:text-gray-50">{TYPING_TEXT}</div>
                  </div>
                   <div className="ml-4 text-xs text-slate-400">{stage < 2 ? 'Assigning…' : stage < 7 ? 'Processing…' : stage < 9 ? 'Review required' : 'Done'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}