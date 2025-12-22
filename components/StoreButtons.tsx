import React from "react";

export const AppleStoreButton = () => {
    return (
        <a
            href="#"
            className="flex items-center gap-3 bg-primary text-white border border-transparent px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 duration-200 hover:-translate-y-1"
        >
            <svg
                viewBox="0 0 384 512"
                fill="currentColor"
                className="w-8 h-8"
            >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 94.3 80.9 95.3 36.3 1.2 43.8-24.7 90.2-24.7 44.4 0 52.5 24.7 89.5 24.7 41.9 0 66.9-46.3 87-83.3 15.5-25.9 23.4-51.8 24.8-54.5-56.1-24.1-60.9-77-62-97.9zM229.2 88c20.6-25 45.4-44.3 81.1-44.1 3.7 32.2-25.4 68.2-51.2 89.6-21.2 18.6-50.5 35.8-78.1 33.1C183.1 126 211.3 103.2 229.2 88z" />
            </svg>
            <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-semibold">Download on the</span>
                <span className="text-xl font-bold font-sans">App Store</span>
            </div>
        </a>
    );
};

export const GooglePlayButton = () => {
    return (
        <a
            href="#"
            className="flex items-center gap-3 bg-primary text-white border border-transparent px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 duration-200 hover:-translate-y-1"
        >
            <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                aria-hidden="true"
            >
                <path
                    d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L47 499z"
                    fill="currentColor"
                />
            </svg>
            <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-medium opacity-80">GET IT ON</span>
                <span className="text-xl font-bold font-sans">Google Play</span>
            </div>
        </a>
    );
};
