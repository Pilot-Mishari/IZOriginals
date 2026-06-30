'use client';

import React from 'react';

export default function ProjectProgress({ status, proofStatus }: { status: string, proofStatus: string }) {
  if (status === 'CANCELLED') {
    return <div className="text-red-600 font-bold text-sm bg-red-50 p-4 rounded-md">Order Cancelled</div>;
  }

  // Determine which step we are on (1 to 4)
  let currentStep = 1;
  if (status === 'COMPLETED') currentStep = 4;
  else if (status === 'PRODUCTION') currentStep = 3;
  else if (proofStatus === 'PENDING_APPROVAL' || proofStatus === 'REVISION_REQUESTED' || proofStatus === 'APPROVED') currentStep = 2;

  const steps = [
    { label: 'Design Phase', step: 1 },
    { label: 'Proof Review', step: 2 },
    { label: 'In Production', step: 3 },
    { label: 'Completed', step: 4 },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 z-0 rounded-full"></div>
        
        {/* Active Blue Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500 rounded-full"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {/* The Dots and Labels */}
        {steps.map((s) => {
          const isActive = s.step <= currentStep;
          return (
            <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-6 h-6 rounded-full border-4 transition-colors duration-300 ${
                isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-neutral-300'
              }`}></div>
              <span className={`absolute top-8 text-xs font-bold whitespace-nowrap ${
                isActive ? 'text-neutral-900' : 'text-neutral-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}