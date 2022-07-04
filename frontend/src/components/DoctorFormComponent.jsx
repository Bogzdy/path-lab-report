import { Container, TextField, Grid, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import useCustomAxios from '../auth/useCustomAxios'
import { GET_DOCTOR_URL, PATCH_DOCTOR_URL } from '../constants/urls'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'

export default function DoctorFormComponent(props) {
    const customAxios = useCustomAxios()
    const [message, setMessage] = useState()
    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState()
    const user = props.user

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
        },
        onSubmit: (values) => {
            updateDoctor()
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email')
                .required('Required'),
            first_name: Yup.string()
                .max(30, 'No more than 30 characters'),
            last_name: Yup.string()
                .max(30, 'No more than 30 characters')
        })
    })

    useEffect(() => {
        console.log(`DoctorFormComponent - user - ${JSON.stringify(user)}`)
        getDoctor()
    }, [])

    const getDoctor = async () => {
        customAxios.get(`${GET_DOCTOR_URL}${user.userId}`)
            .then(response => {
                formik.setValues(value => ({
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email
                }))
            })
            .catch(e => console.log(e))
    }

    const updateDoctor = async () => {
        customAxios.patch(`${PATCH_DOCTOR_URL}${user.userId}`, {
            username: formik.values.username,
            email: formik.values.email,
            first_name: formik.values.first_name,
            last_name: formik.values.last_name
        })
            .then(response => {
                setSeverity('success')
                setMessage('Account update successfully')
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
                            UPDATE
                        </Button>
                    </Grid>
                </Grid>

            </form>
        </Container>
    )
}