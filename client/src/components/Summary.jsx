import { useState } from 'react';
import axios from 'axios';

function removeNewlines(str) {
    return str.replace(/\n/g, ' ');
}

function generatePrompt(text) {
    const cleanedText = removeNewlines(text);
    return `Making sure to include all of the details, create a summary of the following: ${cleanedText}`;
}

const Summary = ({ text }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState(null);

    const handleButtonClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const prompt = generatePrompt(text);
        try {
            const response = await axios.post('http://localhost:3030/api/summarize', { text: prompt });
           setSummary(response.data.result);
        } catch (err) {
          console.error("Error getting summary:", err);
          setError(err);
        } finally {
          setIsLoading(false);
        }
    };       
    return (
        <div>
          <button
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Summary
          </button>
          {isLoading && <div className="loader"></div>}
          {error && <div className="text-red-500">An error occurred.</div>}
          {!isLoading && !error && summary && (
            <div className="mt-4 p-4 bg-gray-200 rounded">{summary}</div>
          )}
        </div>
    );
};

export default Summary;

