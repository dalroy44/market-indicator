import React from 'react';

const StatusCard = ({ label, value, percentage, isPositive }) => {
    const bgClass = isPositive ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`w-full p-6 mb-4 rounded-lg shadow-lg text-white ${bgClass} transition-colors duration-500`}>
            {/* Header/Label */}
            <div className="text-xl font-medium opacity-90 uppercase tracking-wide mb-2">
                {label}
            </div>
            
            {/* Main Value */}
            <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold">
                    {value}
                </span>
                
                {/* Percentage (if provided) */}
                {percentage !== undefined && (
                    <span className="text-lg opacity-90 font-semibold">
                        ({percentage > 0 ? '+' : ''}{percentage}%)
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatusCard;
