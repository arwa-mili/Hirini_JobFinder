

import React, { useEffect, useState } from 'react';
import
    {
        Button,
        Drawer,
        DrawerBody,
        DrawerCloseButton,
        DrawerContent,
        DrawerFooter,
        DrawerHeader,
        DrawerOverlay,
        Stack,
        Select,
        useToast
    } from '@chakra-ui/react';
import axios from 'axios';
import './ExampleDrawer.css'; // Import the CSS file

const DrawerExample = ({ jobId, applicant, onUpdateSuccess }) =>
{
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ status: '' });
    const toast = useToast();

    const onOpen = () => setIsOpen(true);
    const onClose = () =>
    {
        setIsOpen(false);
        setForm({ status: '' });
    };

    const onChangeHandler = (e) =>
    {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    };

    const onUpdateStatus = async () =>
    {
        const { status } = form;
        try
        {
            // Make a PUT request to update the status
            const response = await axios.put(
                `http://localhost:8800/api-v1/jobs/update-job-application/${jobId}/${applicant.id}`,
                {
                    status: status,
                }
            );

            // Check the response status
            if (response.status === 200)
            {
                // Trigger a callback to notify the parent component of the update
                onUpdateSuccess();
                // Show toast message and fetch updated jobs

                onClose(); // Close the drawer
                toast({
                    title: 'Status Updated',
                    description: 'The status has been updated successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else
            {
                console.error('Error updating status. Server returned:', response.data);
            }
        } catch (error)
        {
            console.error('Error updating status:', error.message);
        }
    };

    useEffect(() =>
    {
        setForm({ status: applicant?.status || '' });
    }, [applicant]);

    return (
        <>
            <Button onClick={onOpen}>Update Status</Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md" className="drawer-container">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader className="drawer-header">Update Status</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing="24px">
                            <Select
                                name="status"
                                placeholder="Select status"
                                onChange={onChangeHandler}
                                value={form?.status}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </Select>
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter className="drawer-footer">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={onUpdateStatus}>
                            Update Status
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default DrawerExample;
