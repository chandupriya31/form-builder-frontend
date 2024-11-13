import React, { useEffect, useState } from "react";
import {
    Grid,
    Container,
    Typography,
    IconButton,
    TextField,
    Button,
    Box,
    CardContent,
    Card,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../config/axios";


const FormFieldCard = ({
    field,
    index,
    handleFieldChange,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <Card
            variant="outlined"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
            <IconButton>
                <DragIndicatorIcon />
            </IconButton>
            <CardContent sx={{ flexGrow: 1 }}>
                <TextField
                    variant="standard"
                    key={index}
                    value={field.value}
                    onChange={(event) => handleFieldChange(event, index)}
                    disabled
                    fullWidth
                />
            </CardContent>
            <IconButton onClick={() => handleEditClick(field)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(field)}>
                <DeleteIcon />
            </IconButton>
        </Card>
    );
};


const FormCreation = ({ handleFormAdd, formsList }) => {
    const [isEdit, setisEdit] = useState(false);
    const [isAddInput, setIsAddInput] = useState(false);
    const [formData, setFormData] = useState({
        title: "Untitled Form",
        inputs: [],
    });
    const [fieldsValue, setFieldsValue] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            if (id) {
                const existingForm = await axios.get(`/form/${id}`);
                if (existingForm[0]) {
                    setFormData(existingForm[0]);
                    setIsEditMode(true);
                }
            }
        })();
    }, [formsList, id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/form/${id}/edit`, formData)
                    .then((response) => {
                        console.log(response.data);
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error(error.response?.data?.msg || error.message);
                    });
            } else {
                await axios.post('/form/create', formData)
                    .then((response) => {
                        console.log(response.data);
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error(error.response?.data?.msg || error.message);
                    });
            }
        } catch (error) {
            console.error('Error caught in form submission', error);
        }
    };


    const handleFormUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/form/${id}/edit`, formData)

            const data = await response.data;

            if (response.ok) {
                console.log('Form updated successfully:', data);
                navigate('/');
            } else {
                console.error('Error updating form:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };


    const handleEditClick = () => {
        setisEdit(true);
    };

    const handleTitleChange = (event) => {
        setFormData({ ...formData, title: event.target.value });
    };

    const handleTitleBlur = () => {
        setisEdit(false);
    };

    const handleFieldChange = (event, index) => {
        const updatedFields = [...formData.inputs];
        updatedFields[index].value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            inputs: updatedFields,
        }));
    };

    const handleEditFormFieldClick = (field) => {
        setFieldsValue({ ...field });
    };



    const handleDeleteClick = (field) => {
        const newinputs = formData?.inputs?.filter(
            ({ id }) => id !== field?.id
        );
        setFormData({ ...formData, inputs: newinputs });
    };

    const handleAddInput = ({ value }) => {
        const newField = {
            id: Number(new Date()),
            type: value,
            value: "",
            label: "",
        };
        setFormData((prev) => ({
            ...prev,
            inputs: [...prev.inputs, newField],
        }));
    };


    const handleChange = (type, event) => {
        setFieldsValue({ ...fieldsValue, [type]: event.target.value });
    };

    useEffect(() => {
        if (fieldsValue) {
            setFormData((prev) => ({
                ...prev,
                inputs: prev.inputs.map((field) => {
                    if (field.id === fieldsValue.id) {
                        return { ...fieldsValue };
                    }
                    return field;
                }),
            }));
        }
    }, [fieldsValue]);



    return (
        <Container sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Create new Form
            </Typography>

            <Card sx={{ p: 10 }} className="border border-secondary-subtle">
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography
                                variant="h5"
                                gutterBottom
                            >
                                {formData.title}
                                <IconButton onClick={handleEditClick}>
                                    <EditIcon />
                                </IconButton>
                            </Typography>

                            <Grid container spacing={2} mt={2} ml={-9}>

                                {formData?.inputs?.length > 20 ? (
                                    <Grid item xs={12}>
                                        <Typography color="error" variant="h6" align="center">
                                            The fields should be lesser or equal to 20.
                                        </Typography>
                                    </Grid>
                                ) : (
                                    formData?.inputs?.map((field, index) => (
                                        <Grid item xs={6} key={index}>
                                            <FormFieldCard
                                                field={field}
                                                index={index}
                                                onChange={(event) => handleFieldChange(event, index)}
                                                handleEditClick={handleEditFormFieldClick}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                            <Divider orientation="horizontal" />
                            {isAddInput ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setIsAddInput(false);
                                            setFieldsValue(null);
                                        }}
                                    >
                                        Close Add Input
                                    </Button>
                                    {formData?.inputs?.length >= 20 && <p style={{ color: "red" }}>You cannot add more than 20 input fields.</p>}
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        mt={2}
                                    >
                                        {[
                                            { label: "Text", value: "text" },
                                            { label: "Email", value: "email" },
                                            { label: "Number", value: "number" },
                                            { label: "Password", value: "password" },
                                            { label: "Date", value: "date" },
                                        ].map((type) => (
                                            <Button
                                                key={type.value}
                                                variant="contained"
                                                disabled={formData?.inputs?.length >= 20}
                                                color="primary"
                                                onClick={() => handleAddInput(type)}
                                                sx={{ mx: 1 }}
                                            >
                                                {type.label}
                                            </Button>

                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setIsAddInput(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Add Input
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="success"

                                onClick={(e) => { handleSubmit(e) }}
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                    <Divider />
                    <Grid item xs={4} className="border-start">
                        <Typography variant="h6">Form Editor</Typography>
                        {isEdit ? (
                            <TextField
                                variant="standard"
                                value={
                                    formData?.title === "Untitled Form"
                                        ? ""
                                        : formData?.title
                                }
                                placeholder="Title"
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                autoFocus
                                fullWidth
                            />
                        ) : (
                            null
                        )}
                        {fieldsValue && !isEdit ? (
                            <>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    gutterBottom
                                    align="center"
                                >
                                </Typography>
                                <Typography style={{ marginLeft: "150px", fontWeight: "bold" }}>{fieldsValue?.type?.toUpperCase()}</Typography>
                                <Box>
                                    <TextField
                                        variant="standard"
                                        value={fieldsValue?.value}
                                        label="Title"
                                        onChange={(event) =>
                                            handleChange("value", event)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        variant="standard"
                                        value={fieldsValue?.label || ""}
                                        label="Placeholder"
                                        onChange={(event) =>
                                            handleChange("label", event)
                                        }
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                </Box>
                            </>
                        ) : null}
                    </Grid>
                </Grid>
            </Card>
            <Button
                variant="contained"
                style={{ marginLeft: "50%" }}
                color={isEditMode ? "warning" : "success"}
                onClick={(e) => {
                    if (isEditMode) {
                        handleFormUpdate(e);
                    } else {
                        navigate('/')
                    }
                }}
                sx={{ mt: 2 }}
            >
                {isEditMode ? "Save Form" : "Create Form"}
            </Button>
        </Container>
    );
};

export default FormCreation;