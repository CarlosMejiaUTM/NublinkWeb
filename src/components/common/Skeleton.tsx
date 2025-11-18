import React from "react";

export const Skeleton = ({ height = "h-6", width = "w-full" }: { height?: string; width?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${height} ${width}`} />
);
