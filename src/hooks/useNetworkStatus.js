import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
    // 1. Initialize state safely (checks window existence for safety)
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        // 2. Define the update function
        const updateOnlineStatus = () => {
            // Log to console so you can see it happening in F12 tools
            console.log("Network status changed:", navigator.onLine ? "Online" : "Offline");
            setIsOnline(navigator.onLine);
        };

        // 3. Add Event Listeners
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // 4. Force a check immediately on mount (Fixes the "always green" bug)
        updateOnlineStatus();

        // 5. Cleanup listeners
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    return isOnline;
};

export default useNetworkStatus;