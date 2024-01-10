import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Document, Page, pdfjs } from 'react-pdf';
import DownloadAndView from './DownloadAndView';
import './Applicants.css';
import { Box, Button, useToast } from '@chakra-ui/react';
import { DrawerExample } from '../components';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

const Applicants = () =>
{
    const [jobs, setJobs] = useState([]);
    const { user } = useSelector((state) => state.user);
    const toast = useToast();
    const [form, setForm] = useState({ status: '' });
    const [updateStatus, setUpdateStatus] = useState('');
    const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);


    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


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
    }, [user._id]);

    const handleDownload = (cvUrl, fileName) =>
    {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = fileName || 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleUpdateStatus = async (jobId, applicantId, newStatus) =>
    {

    };






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

                            <DownloadAndView applicant={applicant} handleDownload={handleDownload} />
                            <p className="applicant-details">Cover Letter: {applicant.coverLetter}</p>
                            <p className="applicant-details">Status: {applicant.AppStatus}</p>


                            <Box display="flex" gap="1">
                                <DrawerExample
                                    jobId={job.jobid}
                                    applicant={applicant}
                                    onUpdateSuccess={() => handleUpdateStatus(job.jobid, applicant.id, form.status)}

                                />
                                <Button colorScheme={'red'} onClick={() => setShowDeleteConfirmation(true)}>
                                    <AiFillDelete />
                                </Button>
                            </Box>


                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="job-applications">
                <h1>Your Job Applications</h1>
                {jobs.map((job) => renderJobApplications(job))}
            </div>

            {/* Update Status Drawer */}
            {showUpdateDrawer && (
                <>
                    <div className="overlay" onClick={() => setShowUpdateDrawer(false)} />
                    <div className="update-drawer">
                        <h2 style={{ color: 'yellow' }}>Update Status</h2>
                        <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button style={{ backgroundColor: 'yellow' }} onClick={handleUpdateStatus}>Update</button>
                        <button style={{ backgroundColor: 'yellow' }} onClick={() => setShowUpdateDrawer(false)}>Cancel</button>

                        {/* Content inside the drawer */}
                        <div className="drawer-content" style={{ backgroundColor: 'black' }}>
                            {/* Add your content here with black background */}
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="delete-confirmation-modal">
                    <h2>Delete Confirmation</h2>
                    <p>Are you sure you want to delete this job application?</p>
                    <button onClick={handleDeleteConfirmation}>Yes</button>
                    <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
                </div>
            )}
        </div>
    );
};

export default Applicants;