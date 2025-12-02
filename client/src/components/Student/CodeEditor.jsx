import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Save, Settings, Moon, Sun } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { studentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CodeEditor = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('// Welcome to the Virtual Code Editor\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await studentAPI.runCode(code, language);
      setOutput(response.data.data.output);
      toast.success('Code executed successfully');
    } catch (error) {
      setOutput('Error: Failed to execute code');
      toast.error('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'python' ? 'py' : 'js'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code saved successfully');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2">Virtual Code Editor</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Theme"
          >
            {theme === 'vs-dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleSaveCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Save Code"
          >
            <Save size={18} />
          </button>
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-md"
          >
            <Play size={16} className={isRunning ? "animate-spin" : ""} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={(value) => setCode(value)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
              fontLigatures: true,
            }}
            loading={<div className="flex items-center justify-center h-full text-gray-500">Loading Editor...</div>}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/3 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Output Terminal</span>
            <button
              onClick={() => setOutput('')}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-gray-900 text-gray-300">
            {output ? (
              <pre className="whitespace-pre-wrap break-words">{output}</pre>
            ) : (
              <div className="text-gray-500 italic mt-4 text-center">
                Click "Run Code" to see the output here...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{languages.find(l => l.value === language)?.label}</span>
            <span>Ln {code.split('\n').length}, Col {code.length}</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span>{isRunning ? 'Compiling...' : 'Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;