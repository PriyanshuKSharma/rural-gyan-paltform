import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, Sun, Moon } from 'lucide-react';

const Header = ({ onMenuClick, title }) => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, message: "Welcome to Rural Gyan Platform!", time: "Just now", type: "info" },
    { id: 2, message: "New AI Tutor features available.", time: "2 mins ago", type: "info" },
    { id: 3, message: "System maintenance scheduled for tonight.", time: "1 hour ago", type: "alert" }
  ]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-900/30 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-cyan-500 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider font-mono">
              {title || t('dashboard')}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyan-900/50 text-cyan-500 hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all group"
            title="Change Language"
          >
            <Globe size={16} className="group-hover:animate-spin-slow" />
            <span className="text-xs font-mono font-bold">{i18n.language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-cyan-500 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-cyan-500 hover:text-white hover:bg-white/5 rounded transition-colors relative group"
            >
              <Bell size={20} className="group-hover:animate-swing" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-xl">
                <div className="p-3 border-b border-cyan-500/20 flex justify-between items-center bg-black/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications([])}
                      className="text-xs text-cyan-500 hover:text-cyan-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-xs">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3 border-b border-cyan-500/10 hover:bg-white/5 transition-colors">
                        <div className="flex gap-3">
                          <div className={`w-1 self-stretch rounded-full ${notif.type === 'alert' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                          <div>
                            <p className="text-sm text-gray-200">{notif.message}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;