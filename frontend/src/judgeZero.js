import axios from 'axios';

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";

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
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "90ef3cc051msh196e24185f0fedap187c8ejsn7178b3ec23b5",
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
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "90ef3cc051msh196e24185f0fedap187c8ejsn7178b3ec23b5",
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
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "90ef3cc051msh196e24185f0fedap187c8ejsn7178b3ec23b5",
      }
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting result:", error);
    throw error;
  }
};
