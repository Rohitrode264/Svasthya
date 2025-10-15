import React from "react";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return <div className={`animate-pulse bg-gray-200 rounded ${className || "h-4 w-full"}`} />;
};

export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
};

export const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 64 }) => {
    return <div className="animate-pulse bg-gray-200 rounded-full" style={{ width: size, height: size }} />;
};


