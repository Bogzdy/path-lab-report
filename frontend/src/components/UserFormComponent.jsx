import { Container, TextField, Grid, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import useCustomAxios from '../auth/useCustomAxios'
import { POST_PATIENT_URL } from '../constants/urls'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

export default function UserFormComponent(props) {
    const customAxios = useCustomAxios()
    const [message, setMessage] = useState()
    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState()

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
            medical_history: '',
            birth_date: null
        },
        onSubmit: (values) => {
            postPatient()
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Must be 8 characters or more')
                .max(30, 'No more than 30 characters')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email')
                .required('Required'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Make sure your passwords match')
                .required('Required'),
            first_name: Yup.string()
                .max(30, 'No more than 30 characters'),
            last_name: Yup.string()
                .max(30, 'No more than 30 characters'),
            birth_date: Yup.string()
                .matches(dateRegex, 'Invalid date (e.g 2001-12-20)')
                .transform(function (value, originalValue) {
                    return value === "" ? null : value
                }).nullable()
        })
    })

    const postPatient = async () => {
        customAxios.post(POST_PATIENT_URL, {
            username: formik.values.username,
            password: formik.values.password,
            email: formik.values.email,
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            patient: {
                birth_date: formik.values.birth_date,
                medical_history: formik.values.medical_history
            }
        })
            .then(response => {
                setSeverity('success')
                setMessage('Patient created successfully')
                setOpen(true)
            })
            .catch(e => {
                console.log(e)
                setSeverity('error')
                setMessage(e.response.data)
                setOpen(true)
            })
    }


    return (

        <Dialog
            fullWidth
            maxWidth='md'
            open={props.dialogOpen}
            onClose={props.handleCloseDialog}
        >
            <DialogTitle>Create new patient</DialogTitle>
            <DialogContent>
                <Container align="center" >
                    <form >
                        <Grid
                            container
                            maxWidth='sm'
                            direction="row"
                            justifyContent="center"
                            align="center"
                            spacing='12'
                        >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Collapse in={open}>
                                    <Alert
                                        severity={severity}
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setOpen(false);
                                                    setMessage(null)
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                    >
                                        {message}
                                    </Alert>
                                </Collapse>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} >
                                <TextField
                                    fullWidth
                                    required
                                    name="username"
                                    id="username"
                                    label="Username"
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <div style={{ color: 'red' }}>{formik.errors.username}</div>
                                ) : null}
                            </ Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div style={{ color: 'red' }}>{formik.errors.email}</div>
                                ) : null}
                            </ Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    required
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div style={{ color: 'red' }}>{formik.errors.password}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    id="confirm_password"
                                    name="confirm_password"
                                    label="Confirm Password"
                                    type="password"
                                    required
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirm_password}
                                />
                                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                    <div style={{ color: 'red' }}>{formik.errors.confirm_password}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    id="first_name"
                                    name="first_name"
                                    fullWidth
                                    label="First Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.first_name}
                                />
                                {formik.touched.first_name && formik.errors.first_name ? (
                                    <div style={{ color: 'red' }}>{formik.errors.first_name}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    id="last_name"
                                    name="last_name"
                                    fullWidth
                                    label="Last Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.last_name}
                                />
                                {formik.touched.last_name && formik.errors.last_name ? (
                                    <div style={{ color: 'red' }}>{formik.errors.last_name}</div>
                                ) : null}
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <TextField
                                    multiline
                                    minRows={4}
                                    maxRows={4}
                                    id="medical_history"
                                    name="medical_history"
                                    fullWidth
                                    label="Medical History"
                                    onChange={formik.handleChange}
                                    value={formik.values.medical_history}
                                />
                            </Grid>
                            <Grid item
                                xs={6} sm={6} md={6} lg={6}
                                spacing={10} direction="row"
                                justifyContent="center"
                                align="center"
                                spacing='12'
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        id="birth_date"
                                        name="birth_date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                        label="Birth date YYYY-MM-DD"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.birth_date}
                                    />
                                    {formik.touched.birth_date && formik.errors.birth_date ? (
                                        <div style={{ color: 'red' }}>{formik.errors.birth_date}</div>
                                    ) : null}
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <Button
                                        variant="contained"
                                        sx={{ margin: 2 }}
                                        onClick={formik.handleSubmit}
                                    >
                                        Sign up
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Container>

            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCloseDialog}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}