import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, AlertCircle, Play, Terminal, Code, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

const QuizTaker = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // Map: questionId -> answer
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Navigation State
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  // Code Execution State
  const [executionOutput, setExecutionOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === 0 && !result) {
      handleSubmit();
    }
    if (!timeLeft || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const fetchQuiz = async () => {
    try {
      const response = await studentAPI.getQuizzes();
      const foundQuiz = response.data.data.find(q => q._id === quizId);
      
      if (foundQuiz) {
        // Normalize structure: Ensure sections exist
        if (!foundQuiz.sections || foundQuiz.sections.length === 0) {
          foundQuiz.sections = [{
            _id: 'default',
            title: 'General',
            questions: foundQuiz.questions || []
          }];
        }
        
        setQuiz(foundQuiz);
        const now = new Date();
        const end = new Date(foundQuiz.endTime);
        const diffSeconds = Math.floor((end - now) / 1000);
        
        if (diffSeconds <= 0) {
          toast.error('Quiz has ended');
          navigate('/student/materials');
          return;
        }
        
        setTimeLeft(diffSeconds);
      } else {
        toast.error('Quiz not found');
        navigate('/student/materials');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedOption: optionIndex }
    }));
  };

  const handleCodeChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { codeAnswer: value }
    }));
  };

  const handleRunCode = async (code, language) => {
    setIsExecuting(true);
    setExecutionOutput('Running code...');
    try {
      const response = await studentAPI.runCode(code, language);
      setExecutionOutput(response.data.data.output);
    } catch (error) {
      setExecutionOutput('Error: Failed to execute code.\n' + (error.response?.data?.message || error.message));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitting || result) return;

    // Flatten all questions to check completion
    const allQuestions = quiz.sections.flatMap(s => s.questions);
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < allQuestions.length && timeLeft > 0) {
      if (!window.confirm(`You have answered ${answeredCount} of ${allQuestions.length} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, answerData]) => ({
        questionId,
        ...answerData
      }));

      const response = await studentAPI.submitQuiz(quizId, formattedAnswers);
      setResult(response.data.data);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz) return null;

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You have successfully submitted the quiz.</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.score} / {result.totalMarks}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-500 dark:text-gray-400">Percentage</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.percentage.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Passed</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/materials')}
            className="btn-primary"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const currentSection = quiz.sections[activeSectionIndex];
  const currentQuestion = currentSection.questions[activeQuestionIndex];
  const isLastQuestion = activeQuestionIndex === currentSection.questions.length - 1;
  const isFirstQuestion = activeQuestionIndex === 0;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.subject}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-blue-600'}`}>
            <Clock size={24} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / Section Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Sections</h3>
            <div className="space-y-2">
              {quiz.sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSectionIndex(idx);
                    setActiveQuestionIndex(0);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSectionIndex === idx
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{section.title}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {section.questions.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {currentSection.questions.map((q, idx) => {
                const isAnswered = answers[q._id];
                const isActive = activeQuestionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : isAnswered
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Question Header */}
          <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase">
                  {currentQuestion.type === 'code' ? 'Coding Challenge' : 'Multiple Choice'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Question {activeQuestionIndex + 1} of {currentSection.questions.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentQuestion.question}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{currentQuestion.marks}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Marks</span>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {currentQuestion.type === 'code' ? (
              // HackerRank Style Layout
              <div className="h-full flex flex-col md:flex-row">
                {/* Left: Problem Description (Already shown in header, but could be expanded here if description was long) */}
                {/* For now, we assume the question text in header is sufficient, or we can add a description field later. */}
                {/* Let's use the left side for test cases or additional info if we had it. */}
                {/* Since we only have 'question' string, let's make the editor full width or split with output */}
                
                <div className="flex-1 flex flex-col h-full">
                  <div className="flex-1 relative">
                    <Editor
                      height="100%"
                      language={currentQuestion.codeConfig?.language || 'javascript'}
                      value={answers[currentQuestion._id]?.codeAnswer || ''} // Default template could go here
                      theme="vs-dark"
                      onChange={(value) => handleCodeChange(currentQuestion._id, value)}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 }
                      }}
                    />
                  </div>
                  
                  {/* Terminal / Output Panel */}
                  <div className="h-1/3 bg-gray-900 border-t border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Terminal size={16} />
                        <span className="text-sm font-mono">Console Output</span>
                      </div>
                      <button
                        onClick={() => handleRunCode(answers[currentQuestion._id]?.codeAnswer, currentQuestion.codeConfig?.language || 'javascript')}
                        disabled={isExecuting || !answers[currentQuestion._id]?.codeAnswer}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play size={14} className={isExecuting ? "animate-spin" : ""} />
                        {isExecuting ? 'Running...' : 'Run Code'}
                      </button>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto">
                      {executionOutput ? (
                        <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                      ) : (
                        <span className="text-gray-500 italic">Run your code to see output here...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // MCQ Layout
              <div className="p-8 max-w-3xl mx-auto">
                <div className="space-y-4">
                  {currentQuestion.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all group ${
                        answers[currentQuestion._id]?.selectedOption === oIndex
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                        answers[currentQuestion._id]?.selectedOption === oIndex
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                      }`}>
                        {answers[currentQuestion._id]?.selectedOption === oIndex && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-lg text-gray-700 dark:text-gray-200">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button
              onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={isFirstQuestion}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <div className="flex gap-2">
              {!isLastQuestion ? (
                <button
                  onClick={() => setActiveQuestionIndex(prev => Math.min(currentSection.questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                activeSectionIndex < quiz.sections.length - 1 ? (
                   <button
                    onClick={() => {
                      setActiveSectionIndex(prev => prev + 1);
                      setActiveQuestionIndex(0);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                  >
                    Next Section
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg shadow-green-500/20"
                  >
                    Finish Quiz
                    <CheckCircle size={20} />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
