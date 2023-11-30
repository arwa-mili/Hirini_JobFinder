import React, { useState } from 'react';

const CvMatch = () =>
{
    const [file, setFile] = useState(null);
    const [jobText, setJobText] = useState('');
    const [result, setResult] = useState('');

    const handleFileChange = (event) =>
    {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleJobTextChange = (event) =>
    {
        setJobText(event.target.value);
    };

    const handleSubmit = async () =>
    {
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('jobText', jobText);

        try
        {
            const response = await fetch('http://localhost:3001/api/submit-cv', {
                method: 'POST',
                body: formData,
                headers: {},
            });

            const data = await response.json();
            setResult(data.result);
        } catch (error)
        {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <textarea placeholder="Enter Job Description" value={jobText} onChange={handleJobTextChange}></textarea>
            <button onClick={handleSubmit}>Submit CV</button>
            {result && <div>Result: {result}</div>}
        </div>
    );
}

export default CvMatch;
