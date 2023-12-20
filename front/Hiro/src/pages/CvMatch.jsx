import React, { useState } from 'react';
import './CvMatch.css';

const CvMatch = () =>
{
    const [cvFile, setCvFile] = useState(null);
    const [requirementsFile, setRequirementsFile] = useState(null);
    const [result, setResult] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCvFileChange = (event) =>
    {
        const selectedFile = event.target.files[0];
        setCvFile(selectedFile);
    };

    const handleRequirementsFileChange = (event) =>
    {
        const selectedFile = event.target.files[0];
        setRequirementsFile(selectedFile);
    };

    const handleSubmit = async () =>
    {
        if (!cvFile || !requirementsFile)
        {
            alert('Please select both CV and Job Requirements files.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('cv', cvFile);
        formData.append('requirements', requirementsFile);

        try
        {
            const response = await fetch('http://localhost:5000/api/submit-cv', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok)
            {
                throw new Error('Failed to submit CV. Please try again.');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (error)
        {
            console.error('Error submitting CV:', error.message);
            setError('Error submitting CV. Please try again.');
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <label>
                Upload CV:
                <input type="file" accept=".pdf" onChange={handleCvFileChange} />
            </label>

            <label>
                Upload Job Requirements:
                <input type="file" accept=".pdf" onChange={handleRequirementsFileChange} />
            </label>

            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit CV'}
            </button>

            {result && <div className="result">Result: {result}</div>}
            {error && <div className="error">Error: {error}</div>}
        </div>
    );
};

export default CvMatch;

