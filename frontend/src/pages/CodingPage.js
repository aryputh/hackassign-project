import React, { useState } from 'react';
import { runCode, runTestCase, getResult } from '../components/judgeZero';
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

  const testCases = [
    ['5\n3\n', '8\n'],
    ['0\n0\n', '0\n'],
    ['2\n3\n', '5\n'],
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

  async function handleRunTests() {
    setIsRunning(true);
    var allTestsPassed = true;
    var output = '';

    try {
      for (var i = 0; i < testCases.length; ++i) {
        var currentTestCase = testCases[i];

        const token = await runTestCase(language, code, currentTestCase[0], currentTestCase[1]);  // Send code to Judge0 for compilation
        let result = await getResult(token);          // Fetch result from Judge0

        // Wait until the result is ready
        while (result.status.id === 2) {
          // Status 2 means processing
         result = await getResult(token);
        }

        if (result.status.id === 3) {
          if (result.stdout && result.stdout.trim() !== '') {
            if (result.stdout === currentTestCase[1]) {
              output += "Test case with input\n" + currentTestCase[0] + "passed with output\n" + currentTestCase[1];
            }
          
            console.log(result.stdout);
          }
        }
        else {
          allTestsPassed = false;
          output += "Test case with input\n" + currentTestCase[0] + "returned\n" + result.stdout + "but expected\n" + currentTestCase[1];
        }
      }

      if (allTestsPassed) {
        setOutput(output + 'All test cases passed!');
      } else {
        setOutput(output);
      }
    } catch (error) {
      setOutput('Error running code: ' + error.message);
    }

    setIsRunning(false);
  };

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
    setOutput("Changed language to language ID " + event.target.value);
  };

  return (
    <div>
      <h1>Develop Code Here!</h1>
      <select value={language} onChange={handleLanguageChange}>
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
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
      <button className="secondary-btn" onClick={handleSubmit} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
      <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
        Return to Dashboard
      </button>
      <button className="secondary-btn" onClick={handleRunTests} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Test Cases'}
      </button>

      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};
