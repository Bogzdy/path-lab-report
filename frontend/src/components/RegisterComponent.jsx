import { Container, TextField, Grid, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'
import { useParams, useNavigate } from 'react-router-dom';
import { SIGNUP_PATIENT_URL, SIGNUP_DOCTOR_URL } from '../constants/urls'

export default function RegisterComponent(props) {
    const { type } = useParams()
    const [postUrl, setPostUrl] = useState()
    const [message, setMessage] = useState()
    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (type === 'patient') setPostUrl(SIGNUP_PATIENT_URL)
        if (type === 'doctor') setPostUrl(SIGNUP_DOCTOR_URL)
        console.log(postUrl)
    }, [])

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            email: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
        },
        onSubmit: (values) => {
            postAccount()
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
                .max(30, 'No more than 30 characters')
        })
    })

    const postAccount = async () => {
        axios.post(postUrl, {
            username: formik.values.username,
            password: formik.values.password,
            email: formik.values.email,
            first_name: formik.values.first_name,
            last_name: formik.values.last_name
        })
            .then(response => {
                setSeverity('success')
                setMessage(`${type.charAt(0).toUpperCase().concat(type.substring(1))} created successfully`)
                setOpen(true)
                formik.setValues({
                    username: '',
                    password: '',
                    email: '',
                    confirm_password: '',
                    first_name: '',
                    last_name: ''
                }, false)
                setTimeout(() => navigate('/login'), 1000)
            })
            .catch(e => {
                console.log(e)
                setSeverity('error')
                setMessage(e.response.data.message)
                setOpen(true)
            })
            .finally(() => setTimeout(() => setOpen(false), 3000))
    }


    return (
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
                    <Grid item xs={12} sm={12} md={12} lg={12} >
                        <Button
                            variant="contained"
                            sx={{ margin: 2 }}
                            onClick={formik.handleSubmit}
                        >
                            Register
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Container>

    )
}