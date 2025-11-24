import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useAuth } from '../../hooks/useAuth'; 

// --- Icon Components (No changes) ---
const UserIcon = ({ size = 20, ...props }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const HomeIcon = ({ size = 20, ...props }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const ShareIcon = ({ size = 20, ...props }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M16 6l-4-4-4 4" /><line x1="12" y1="2" x2="12" y2="17" /></svg>;

const LogoutIcon = ({ size = 20, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const OnlineIcon = ({ size = 20, isOnline = true, ...props }) => (
    <div className={`flex items-center gap-1 text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-500'}`} {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h.01" /><path d="M8.5 16h7" /><path d="M5 12h14" /></svg>
        <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
    </div>
);

const ThemeIcon = ({ size = 20, isDark, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {isDark ? (
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="fill-white" />
        ) : (
            <g><circle cx="12" cy="12" r="4" className="fill-yellow-500" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="m2 12h2" /><path d="m20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></g>
        )}
    </svg>
);

const SmartNotesLogo = ({ theme }) => (
    <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 15h8" />
            <path d="M8 11h8" />
        </svg>
        <span className={`font-semibold text-xl tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SmartNotes</span>
    </div>
);

const Button = React.forwardRef(({ className = '', variant = 'ghost', size = 'icon', theme = 'dark', children, ...props }, ref) => {
    const Comp = 'button';
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50";
    const darkHover = 'hover:bg-gray-700/50 text-gray-400 hover:text-white';
    const lightHover = 'hover:bg-gray-200/50 text-gray-600 hover:text-gray-900';
    const variantClasses = {
      ghost: theme === 'dark' ? darkHover : lightHover,
      default: "bg-indigo-600 text-white hover:bg-indigo-700"
    };
    const sizeClasses = {
      icon: "h-9 w-9",
    };
    return <Comp className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} ref={ref} {...props}>{children}</Comp>;
});
Button.displayName = 'Button';

// --- Navbar Component ---

export function Navbar() {
    const [theme, setTheme] = useState('dark');
    const isOnline = useNetworkStatus();
    
    // Destructure 'signOut' and 'user' from auth context (using 'user' as defined in your AuthContext)
    // If your AuthContext exposes the user as 'user' and not 'currentUser', use 'user' here.
    const { signOut, user } = useAuth(); 
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogout = async () => {
        try {
            if (signOut) {
                await signOut(); 
                console.log("User successfully signed out.");
            }
            navigate('/signin'); 
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const glassClasses = theme === 'dark'
        ? 'bg-gray-900/50 border-gray-700/50 backdrop-blur-md' 
        : 'bg-white/70 border-gray-300/80 backdrop-blur-sm'; 

    const NavLink = ({ to, Icon, label, className = '' }) => {
        const isActive = to === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(to);
        
        const base = theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800/70' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70';
        const active = theme === 'dark' ? 'bg-gray-700/70 border-indigo-500 text-white' : 'bg-gray-200/70 border-indigo-600 text-gray-900';
        const inactive = 'border-transparent';

        return (
            <Link 
                to={to} 
                className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2
                    ${isActive ? active : base + ' ' + inactive}
                    ${className}
                `}
            >
                <Icon size={16} />
                {/* Fix: Hide label on screens smaller than 'sm' for responsiveness */}
                <span className="hidden sm:inline">{label}</span>
            </Link>
        );
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-20 border-b shadow-lg transition-colors ${glassClasses}`}>
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex-shrink-0">
                        <SmartNotesLogo theme={theme} />
                    </Link>

                    {/* Desktop/Tablet Navigation */}
                    <nav className="hidden sm:flex h-full items-center">
                        <NavLink to="/" Icon={HomeIcon} label="My Notes" />
                        <NavLink to="/shared" Icon={ShareIcon} label="Shared Notes" />
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <OnlineIcon isOnline={isOnline} size={18} />

                    <Button 
                        variant="ghost" size="icon" theme={theme}
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <ThemeIcon isDark={theme === 'dark'} size={20} />
                    </Button>

                    {/* Conditional Rendering: Show Profile/Sign Out if user is logged in */}
                    {user ? (
                        <>
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" theme={theme} title="Profile">
                                    <UserIcon size={20} />
                                </Button>
                            </Link>

                            <Button 
                                variant="ghost" 
                                size="icon" 
                                theme={theme} 
                                onClick={handleLogout}
                                title="Sign Out"
                                className="text-red-400 hover:text-red-500 hover:bg-red-500/10" 
                            >
                                <LogoutIcon size={20} />
                            </Button>
                        </>
                    ) : (
                        // Show Sign In link if user is logged out
                        <Link to="/signin">
                            <Button variant="ghost" size="icon" theme={theme} title="Sign In">
                                <UserIcon size={20} />
                            </Button>
                        </Link>
                    )}

                </div>
            </div>
            
            {/* Mobile Navigation Bar (Bottom) */}
            <nav className={`sm:hidden flex justify-around border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/80'} py-1`}>
                {/* Fix: We now render NavLink with *only* the Icon for mobile, leveraging the existing classes. */}
                <NavLink to="/" Icon={HomeIcon} label="My Notes" className="flex-1 justify-center" />
                <NavLink to="/shared" Icon={ShareIcon} label="Shared Notes" className="flex-1 justify-center" />
            </nav>
        </header>
    );
}

export default Navbar;