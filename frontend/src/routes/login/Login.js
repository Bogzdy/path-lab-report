import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, Collapse, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { useAuthContext } from '../../auth/AuthContext'
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { LOGIN_URL } from '../../constants/urls'

export default function Login() {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState()
    const [severity, setSeverity] = useState()
    const navigate = useNavigate()
    let { setAccessToken, setRefreshToken, setUser } = useAuthContext()

    async function handleSubmit() {
        axios.post(LOGIN_URL, {
            username: username,
            password: password
        })
            .then(response => {
                localStorage.setItem("access", response.data.access)
                localStorage.setItem("refresh", response.data.refresh)
                localStorage.setItem('isStaff', response.data.user.is_staff)
                localStorage.setItem('userId', response.data.user.id)
                setAccessToken(response.data.access)
                setRefreshToken(response.data.refresh)
                setUser({
                    userId: response.data.user.id,
                    isStaff: response.data.user.is_staff
                })
                navigate("/", { replace: true })
            })
            .catch(e => {
                console.log(e)
                setSeverity('error')
                setMessage(e.response.data.message)
            })
            .finally(() => {
                setOpen(true)
            })
    }


    return (
        <Container maxWidth="sm" align='center'>
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
            <Grid container maxWidth='60%' rowSpacing={2} >
                <Grid item sm={12} md={12} lg={12} align='center'>
                    <Typography variant="h4" align="center">
                        Sign in
                    </Typography>
                </Grid>
                <Grid item sm={12} md={12} lg={12} align='center'>
                    <TextField
                        fullWidth
                        required
                        id="username"
                        label="Username"
                        variant="filled"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item sm={12} md={12} lg={12} align='center'>
                    <TextField
                        fullWidth
                        required
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item sm={12} md={12} lg={12} align='center'>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Log In
                    </Button>
                </Grid>
                <Grid item sm={12} md={12} lg={12} align='center'>
                    <Link to='/register'>Don't have an account? Click here!</Link>
                </Grid>

            </Grid>
        </Container>
    )
}