import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Save, Download, Settings } from 'lucide-react';
import { studentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CodeEditor = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('// Welcome to the Virtual Code Editor\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Virtual Code Editor</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveCode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Save Code"
          >
            <Save size={18} />
          </button>
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={16} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm text-gray-600 dark:text-gray-400">Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 border-none outline-none resize-none"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/3 flex flex-col border-l border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Output</span>
            <button
              onClick={() => setOutput('')}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-4 bg-gray-900 text-gray-300 font-mono text-sm overflow-y-auto">
            <pre className="whitespace-pre-wrap">{output || 'Run your code to see output here...'}</pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Language: {languages.find(l => l.value === language)?.label}</span>
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;