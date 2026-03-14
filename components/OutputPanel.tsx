import React from 'react';
import type { ImageItem } from '../App';
import { CopyButton } from './CopyButton';

interface OutputPanelProps {
    images: ImageItem[];
    onGenerateItem: (id: string) => void;
}

const OutputCard: React.FC<{ title: string; children: React.ReactNode; textToCopy: string }> = ({ title, children, textToCopy }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 relative group/card">
        <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <CopyButton textToCopy={textToCopy} />
        </div>
        <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">{title}</h4>
        {children}
    </div>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ images, onGenerateItem }) => {
    
    const downloadCSV = () => {
        const completedImages = images.filter(img => img.status === 'success' && img.metadata);
        if (completedImages.length === 0) return;

        const headers = ['Filename', 'Title', 'Alt Text', 'Tags'];
        const rows = completedImages.map(img => [
            `"${img.file.name.replace(/"/g, '""')}"`,
            `"${img.metadata!.title.replace(/"/g, '""')}"`,
            `"${img.metadata!.altText.replace(/"/g, '""')}"`,
            `"${img.metadata!.tags.join(', ').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `metadata_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasCompleted = images.some(img => img.status === 'success');

    if (images.length === 0) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-lg shadow-2xl flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-700 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-400">Awaiting Generation</h3>
                <p className="text-sm text-gray-500 mt-2">Upload images to start generating metadata.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-2xl border border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Generated Results</h2>
                {hasCompleted && (
                    <button 
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-all text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download CSV
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                {images.map((image) => (
                    <div key={image.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg group">
                        <div className="flex items-start gap-4 mb-4">
                            <img src={image.preview} alt="Thumbnail" className="w-24 h-24 object-cover rounded-lg border border-gray-600" />
                            <div className="flex-grow min-w-0">
                                <h3 className="text-lg font-bold text-gray-100 truncate">{image.file.name}</h3>
                                <div className="mt-1">
                                    {image.status === 'loading' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </span>
                                    )}
                                    {image.status === 'success' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    )}
                                    {image.status === 'error' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Failed
                                        </span>
                                    )}
                                    {image.status === 'idle' && (
                                        <button 
                                            onClick={() => onGenerateItem(image.id)}
                                            className="text-xs text-purple-400 hover:text-purple-300 font-medium underline"
                                        >
                                            Generate now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {image.status === 'error' && (
                            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg text-red-300 text-sm">
                                {image.error || 'Failed to generate metadata.'}
                                <button 
                                    onClick={() => onGenerateItem(image.id)}
                                    className="ml-2 underline hover:text-red-200"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {image.metadata && (
                            <div className="grid grid-cols-1 gap-3">
                                <OutputCard title="Title" textToCopy={image.metadata.title}>
                                    <p className="text-gray-300 text-sm">{image.metadata.title}</p>
                                </OutputCard>

                                <OutputCard title="Alt Text" textToCopy={image.metadata.altText}>
                                     <p className="text-gray-300 text-sm">{image.metadata.altText}</p>
                                </OutputCard>

                                <OutputCard title="Tags" textToCopy={image.metadata.tags.join(', ')}>
                                    <div className="flex flex-wrap gap-1.5">
                                        {image.metadata.tags.map((tag, index) => (
                                            <span key={index} className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </OutputCard>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};