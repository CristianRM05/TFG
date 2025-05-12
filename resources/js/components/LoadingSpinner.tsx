import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-[9999]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8F5C0C] dark:border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
