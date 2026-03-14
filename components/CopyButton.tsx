import React, { useState } from 'react';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <button
            onClick={handleCopy}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                isCopied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
        >
            {isCopied ? 'Copied!' : 'Copy'}
        </button>
    );
};
