import { Container, Grid, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import GridOfReports from '../../components/GridOfReports'
import { useAuthContext } from '../../auth/AuthContext'


export default function ListOfReports(props) {
    const navigate = useNavigate()
    const { user } = useAuthContext()

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Container maxWidth="lg">
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={12}>
                        {user.isStaff &&
                            <Button
                                variant="contained"
                                onClick={() => navigate('add', { replace: true })}>
                                ADD REPORT
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <GridOfReports />
            </Container>
        </Container>
    );
}