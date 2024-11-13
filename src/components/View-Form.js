import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button, Paper, Grid } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import axios from "../config/axios";

function View() {
    const { id } = useParams();
    const [formDetails, setFormDetails] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});

    console.log("params id", id);

    useEffect(() => {
        if (id) {
            const fetchFormDetails = async () => {
                try {
                    const response = await axios.get(`/form/${id}`);
                    console.log("Form data", response.data);

                    const data = response?.data[0];
                    if (data) {
                        setFormDetails(data);

                        const initialFormValues = data?.inputs?.reduce((acc, field) => {
                            acc[field.input_value] = '';
                            return acc;
                        }, {});
                        setFormValues(initialFormValues);
                    } else {
                        console.error("No data found for the form");
                    }
                } catch (err) {
                    console.error("Error fetching form details:", err);
                }
            };

            fetchFormDetails();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors = {};

        formDetails?.inputs?.forEach((field) => {
            const value = formValues[field.input_value];

            if (!value) {
                tempErrors[field.input_value] = `${field.placeholder} is required`;
            } else {
                switch (field.selected_type) {
                    case "Email":
                        if (!/\S+@\S+\.\S+/.test(value)) {
                            tempErrors[field.input_value] = "Invalid email format";
                        }
                        break;
                    case "Text":
                        if (value.trim().length === 0) {
                            tempErrors[field.input_value] = "This field cannot be empty";
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            alert('Form submitted: Thank you! Open console for form data');
            console.log("Form Submitted:", formValues);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f0f0",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    width: "100%",
                    maxWidth: 600,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    {formDetails?.title || "Form Title"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        {formDetails?.inputs?.map((field) => (
                            <Grid item xs={12} key={field?._id}>
                                <TextField
                                    fullWidth
                                    id={`field-${field?._id}`}
                                    name={field.input_value}
                                    type={field?.selected_type?.toLowerCase()}
                                    label={field.input_value}
                                    placeholder={field.placeholder}
                                    variant="standard"
                                    value={formValues[field.input_value] || ""}
                                    onChange={handleChange}
                                    error={!!errors[field.input_value]}
                                    helperText={errors[field.input_value]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ marginTop: 3 }}>
                        <Button variant="contained" color="success" sx={{ width: "100%" }} type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default View;
