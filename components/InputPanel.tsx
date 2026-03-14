import React, { useRef } from 'react';
import type { ImageItem } from '../App';

interface InputPanelProps {
    onImagesChange: (files: FileList | null) => void;
    images: ImageItem[];
    onRemoveImage: (id: string) => void;
    onGenerateAll: () => void;
    isProcessing: boolean;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const InputPanel: React.FC<InputPanelProps> = ({ onImagesChange, images, onRemoveImage, onGenerateAll, isProcessing }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onImagesChange(event.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const hasImages = images.length > 0;
    const idleImagesCount = images.filter(img => img.status === 'idle' || img.status === 'error').length;

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-2xl flex flex-col h-full border border-gray-700">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Upload Images</h2>
            
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 text-gray-100 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg transition-all duration-300 shadow-md hover:border-purple-500/50 hover:bg-gray-900/80 cursor-pointer group mb-6"
            >
                <div className="text-center">
                    <UploadIcon className="w-12 h-12 text-gray-500 mx-auto mb-4 group-hover:text-purple-400 transition-colors" />
                    <p className="text-gray-400 group-hover:text-white transition-colors">
                        <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                    multiple
                    disabled={isProcessing}
                />
            </div>

            {hasImages && (
                <div className="flex-grow overflow-y-auto pr-2 space-y-3 max-h-[400px]">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Selected Images ({images.length})</h3>
                    {images.map((image) => (
                        <div key={image.id} className="flex items-center gap-3 bg-gray-900/80 p-2 rounded-lg border border-gray-700 group">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <img src={image.preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                {image.status === 'loading' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">{image.file.name}</p>
                                <p className="text-xs text-gray-500">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button 
                                onClick={() => onRemoveImage(image.id)}
                                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                disabled={image.status === 'loading'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onGenerateAll}
                disabled={isProcessing || idleImagesCount === 0}
                className="w-full mt-6 p-4 text-white font-bold bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </span>
                ) : (
                    `Generate Metadata for ${idleImagesCount} Image${idleImagesCount !== 1 ? 's' : ''}`
                )}
            </button>
        </div>
    );
};