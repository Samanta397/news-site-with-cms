import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full justify-center items-center">
      <div className="flex h-full flex-col justify-center px-8 py-12 lg:px-8 bg-white border rounded-lg border-gray-300">
        {children}
      </div>
    </div>
  );
}
