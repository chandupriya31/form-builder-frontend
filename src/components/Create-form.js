import React, { useEffect, useState } from "react";
import {
    Grid,
    Container,
    Typography,
    IconButton,
    Button,
    Box,
    TextField,
    CardContent,
    Card,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../config/axios";

const FormFieldCard = ({ field, index, handleChange, handleEdit, handleDelete }) => {
    return (
        <Card variant="outlined" sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <IconButton>
                <DragIndicatorIcon />
            </IconButton>
            <CardContent sx={{ flexGrow: 1 }}>
                <TextField
                    variant="standard"
                    key={index}
                    value={field.value}
                    onChange={(event) => handleChange(event, index)}
                    disabled={true}
                    fullWidth
                />
            </CardContent>
            <IconButton onClick={() => handleEdit(field)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(field)}>
                <DeleteIcon />
            </IconButton>
        </Card>
    );
};

const FormCreation = ({ formsData }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [addInput, setAddInput] = useState(false);
    const [form, setForm] = useState({ title: 'Untitled Data', inputs: [] });
    const [formInputs, setFormInputs] = useState(null);
    const [edit, setEdit] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            (async () => {
                const response = await axios.get(`/form/${id}`);
                setForm(response.data[0]);
                setEdit(true);
            })();
        }
    }, [formsData, id]);

    useEffect(() => {
        if (formInputs) {
            setForm((prev) => ({
                ...prev,
                inputs: prev.inputs.map((field) => {
                    if (field.id === formInputs.id) {
                        return { ...formInputs };
                    }
                    return field;
                }),
            }));
        }
    }, [formInputs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (edit) {
                await axios.put(`/form/${id}/edit`, form)
                    .then((response) => {
                        console.log(response.data);
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error(error.response?.data?.msg || error.message);
                    });
            } else {
                await axios.post('/form/create', form)
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

    const handleTitleChange = (event) => {
        setForm({ ...form, title: event.target.value });
    };

    const handleEditTitle = () => {
        setIsEdit(true);
    };

    const handleChange = (event, index) => {
        const updatedFields = form.inputs.map((field, idx) => {
            if (idx === index) {
                return { ...field, value: event.target.value };
            }
            return field;
        });
        setForm({ ...form, inputs: updatedFields });
    };

    const handleFormUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/form/${id}/edit`, form)
                .then((response) => {
                    console.log(response.data);
                    navigate('/');
                })
                .catch((error) => {
                    console.error(error.response?.data?.msg || error.message);
                });
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleEditFormFieldClick = (field) => {
        setFormInputs({ ...field });
    };

    const handleDelete = (field) => {
        const newFormFields = form?.inputs?.filter(({ id }) => id !== field?.id);
        setForm({ ...form, inputs: newFormFields });
    };

    const handleAddInput = ({ value }) => {
        const newField = {
            id: new Date().getTime(),
            type: value,
            value: "",
            label: "",
        };
        setForm((prev) => ({
            ...prev,
            inputs: [...prev.inputs, newField],
        }));
    };

    const handleTitlePlaceHolderChange = (type, event) => {
        const updatedField = { ...formInputs, [type]: event.target.value };
        setFormInputs(updatedField);

        const updatedInputs = form.inputs.map((input) => {
            if (input.id === updatedField.id) {
                return { ...input, [type]: event.target.value };
            }
            return input;
        });

        setForm({ ...form, inputs: updatedInputs });
    };

    return (
        <Container sx={{ p: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom align="center">
                {edit ? "Edit Form" : "Create New Form"}
            </Typography>

            <Card sx={{ p: 10 }} className="border border-secondary-subtle">
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h5">
                                {form.title}
                                <IconButton onClick={handleEditTitle}>
                                    <EditIcon />
                                </IconButton>
                            </Typography>

                            <Grid container spacing={2} mt={2}>
                                {form?.inputs?.map((field, index) => (
                                    <Grid item xs={6} key={index}>
                                        <FormFieldCard
                                            field={field}
                                            index={index}
                                            handleChange={handleChange}
                                            handleEdit={handleEditFormFieldClick}
                                            handleDelete={handleDelete}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Divider orientation="horizontal" />
                            {addInput ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setAddInput(false)}
                                    >
                                        Close Add Input
                                    </Button>
                                    <Box display="flex" flexDirection="row" mt={2}>
                                        {[{ label: "Text", value: "text" }, { label: "Email", value: "email" }, { label: "Number", value: "number" }, { label: "Password", value: "password" }, { label: "Date", value: "date" }].map((type) => (
                                            <Button
                                                key={type.value}
                                                variant="contained"
                                                onClick={() => handleAddInput(type)}
                                            >
                                                {type.label}
                                            </Button>
                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => setAddInput(true)}
                                >
                                    Add Input
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    <Divider />

                    <Grid item xs={4} className="border-start">
                        <Typography variant="h5">Form Editor</Typography>
                        {isEdit ? (
                            <TextField
                                variant="standard"
                                value={form?.title === "Untitled Form" ? "" : form?.title}
                                placeholder="Title"
                                onChange={handleTitleChange}
                                onBlur={handleEditTitle}
                                autoFocus
                                fullWidth
                            />
                        ) : null}

                        {formInputs && !isEdit ? (
                            <Box>
                                <Typography variant="h6">{formInputs?.type?.toUpperCase()}</Typography>
                                <TextField
                                    variant="standard"
                                    value={formInputs?.value}
                                    label="Value"
                                    onChange={(event) => handleTitlePlaceHolderChange("value", event)}
                                    fullWidth
                                />
                                <TextField
                                    variant="standard"
                                    value={formInputs?.label || ""}
                                    label="Placeholder"
                                    onChange={(event) => handleTitlePlaceHolderChange("label", event)}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="success"

                                    onClick={(e) => { handleSubmit(e) }}
                                    sx={{ mt: 2 }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        ) : null}
                    </Grid>
                </Grid>
            </Card>

            {/* Submit Form Button */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                        if (isEdit) {
                            handleFormUpdate(e);
                        } else {
                            navigate('/')
                        }
                    }}
                    sx={{ width: "200px" }}
                >
                    {edit ? "Save Form" : "Create Form"}
                </Button>
            </Box>
        </Container >
    );
};

export default FormCreation;
