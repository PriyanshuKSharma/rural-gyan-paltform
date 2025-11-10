import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, Sun, Moon } from 'lucide-react';

const Header = ({ onMenuClick, title }) => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = React.useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title || t('dashboard')}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Change Language"
          >
            <Globe size={18} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? (
              <Sun size={18} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={18} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <Bell size={18} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;