import axios from 'axios';

const JUDGE0_API_URL = process.env.REACT_APP_JUDGE0_API_URL;
const JUDGE0_API_HOST = process.env.REACT_APP_JUDGE0_API_HOST;
const JUDGE0_API_KEY = process.env.REACT_APP_JUDGE0_API_KEY;

export async function runCode(language, code) {
  try {
    // Request body for Judge0
    const data = {
      language_id: language,  // Language ID
      source_code: code,      // Source code to compile
      stdin: '',              
    };

    // Making POST request to Judge0 API
    const response = await axios.post(JUDGE0_API_URL, data, {
      headers: {
        "X-RapidAPI-Host": JUDGE0_API_HOST,
        "X-RapidAPI-Key": JUDGE0_API_KEY,
      }
    });

    // Return the submission ID, which is needed to get the result
    return response.data.token;
  } catch (error) {
    console.error("Error running code:", error);
    throw error;
  }
};

export async function runTestCase(language, code, input, expectedOutput) {
  try {
    const data = {
      language_id: language,
      source_code: code,
      stdin: input,
      expected_output: expectedOutput,
    }

    const response = await axios.post(JUDGE0_API_URL, data, {
      headers: {
        "X-RapidAPI-Host": JUDGE0_API_HOST,
        "X-RapidAPI-Key": JUDGE0_API_KEY,
      }
    });

    return response.data.token;
  } catch (error) {
    console.error("Error running code:", error);
    throw error;
  }
};

// Get result after code is compiled
export async function getResult(token) {
  try {
    const response = await axios.get(`${JUDGE0_API_URL}/${token}`, {
      headers: {
        "X-RapidAPI-Host": JUDGE0_API_HOST,
        "X-RapidAPI-Key": JUDGE0_API_KEY,
      }
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting result:", error);
    throw error;
  }
};
