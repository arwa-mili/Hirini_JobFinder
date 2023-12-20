
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import './Applicants.css'

const Applicants = () =>
{
    const [jobs, setJobs] = useState([]);
    const { user } = useSelector((state) => state.user);

    useEffect(() =>
    {

        const fetchJobs = async () =>
        {
            try
            {
                const _id = user._id;
                const response = await axios.get(`http://localhost:8800/api-v1/jobs/get-jobs-by-company/${_id}`);
                setJobs(response.data.data);
            } catch (error)
            {
                console.error('Error fetching jobs:', error.message);
            }
        };

        fetchJobs();
    }, []);

    const renderJobApplications = (job) =>
    {
        return (
            <div key={job._id} className="job-card">
                <h2 className="job-title">{job.jobTitle}</h2>
                <ul className="applicant-list">
                    {job.applicants.map((applicant) => (
                        <li key={applicant._id} className="applicant-item">
                            <p className="applicant-details">Candidate Name: {applicant.candidateName}</p>
                            <p className="applicant-details">Candidate Surname: {applicant.candidateSurname}</p>
                            <p className="applicant-details">Email: {applicant.email}</p>
                            <p className="applicant-details">CV: {applicant.pdf}</p>
                            <p className="applicant-details">Cover Letter: {applicant.coverLetter}</p>

                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="container">
            <div class="job-applications">
                <h1>Your Job Applications</h1>
                {jobs.map((job) => renderJobApplications(job))}
            </div></div>
    );
};

export default Applicants;