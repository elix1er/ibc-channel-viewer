import React from 'react';

import { Card } from '@/components/ui/card';

interface LoadingBorderCardProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingBorderCard: React.FC<LoadingBorderCardProps> = ({
  isLoading,
  children,
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] animate-spin-slow">
            <div className="h-full w-full bg-conic-gradient" />
          </div>
        </div>
      )}
      <Card
        className={`relative m-[5px] shadow-lg ${isLoading ? 'border-transparent' : ''}`}
      >
        {children}
      </Card>
    </div>
  );
};

export default LoadingBorderCard;
