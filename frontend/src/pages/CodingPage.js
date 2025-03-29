import React, { useState } from 'react';
import { runCode, getResult } from '../judgeZero';
import { useNavigate } from 'react-router-dom';

export default function CodingPage() {
  const [language, setLanguage] = useState(109);  // Set default language to Python (109)
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const languageOptions = [
    { label: 'Python', value: 109 },
    { label: 'Java', value: 91 },
    { label: 'C++', value: 105 },
  ];

  async function handleSubmit() {
    setIsRunning(true);
    setOutput('Running your code...');

    try {
      const token = await runCode(language, code);  // Send code to Judge0 for compilation
      let result = await getResult(token);          // Fetch result from Judge0

      // Wait until the result is ready
      while (result.status.id === 2) {
        // Status 2 means processing
        result = await getResult(token);
      }

      if (result.status.id === 3) {
        if (result.stdout && result.stdout.trim() !== '') {
          // If there's stdout (output), display it
          setOutput(result.stdout);
        } else if (result.stderr && result.stderr.trim() !== '') {
          // If there's stderr (error), display it
          setOutput(result.stderr);
        } else {
          // If both stdout and stderr are empty, display a message
          setOutput('No output or error was returned.');
        }
      } else {
        // Handle other statuses
        setOutput('Error ID: ' + result.status.id + ' Description: ' + result.status.description);
      }
    } catch (error) {
      setOutput('Error running code: ' + error.message);
    }
    setIsRunning(false);
  };

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
    setOutput("Changed language to language ID " + event.target.value);
  }

  return (
    <div>
      <h1>Develop Code Here!</h1>
      <select value={languageOptions['Python']} onChange={handleLanguageChange}>
        {languageOptions.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
      <button onClick={() => navigate("/dashboard")}>
        Return to Dashboard
      </button>
      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};
