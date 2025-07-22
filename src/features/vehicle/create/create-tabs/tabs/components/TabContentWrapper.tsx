import React from 'react';

interface TabContentWrapperProps {
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}

export function TabContentWrapper({ children, isEmpty, emptyMessage }: TabContentWrapperProps) {
  return (
    <div className="flex-1 min-h-[400px] max-h-[700px] flex flex-col overflow-y-auto w-full mb-4 border rounded-md p-6">
      {isEmpty ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
