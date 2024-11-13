import { Box, Button, Card, Container, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

const FormList = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get('/forms');
                setForms(response.data);
            } catch (error) {
                console.error("Error fetching forms:", error);
            }
        };
        fetchForms();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`/form/${id}`).then(response => {
            console.log(response.data);
            setForms(prevForms => prevForms.filter(form => form._id !== id));
        }).catch(error => {
            console.log(error?.response?.data);
        })
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to Form.com
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                This is a simple form builder.
            </Typography>
            <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
                <Link to="/form/create" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="success">
                        CREATE NEW FORM
                    </Button>
                </Link>
            </Box>

            <Divider variant="middle" sx={{ mb: 4 }} />

            <Grid container spacing={4} display="flex" justifyContent="flex-start">
                <Grid item xs={12}>
                    <Typography variant="h5">Forms</Typography>
                </Grid>

                <Grid item xs={14} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                    {forms.length > 0 ? (
                        forms.map((form) => (
                            <Grid item key={form?._id} xs={14} sm={6} md={4} lg={4} sx={{ mb: 2 }}>
                                <Card sx={{ p: 1 }}>
                                    <Typography variant="h5" component="h2" align="center">
                                        {form?.title}
                                    </Typography>
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Link to={`/form/view/${form?._id}`}>
                                            <Button variant="text" color="success" sx={{ mx: 1 }}>
                                                View
                                            </Button>
                                        </Link>
                                        <Link to={`/form/edit/${form?._id}`}>
                                            <Button variant="text" color="primary" sx={{ mx: 1 }}>
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button variant="text" color="error" sx={{ mx: 1 }} onClick={() => handleDelete(form._id)} >
                                            Delete
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            You have no forms created yet.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default FormList;
