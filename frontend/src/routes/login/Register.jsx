import { Button, Container, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function Register(props) {

  return (
    <Container maxWidth="md" >
      <Box sx={{ textAlign: 'center' }} >
        <Link to='patient'>
          <Button variant="text">I'm a patient</Button>
        </Link>
        <Link to='doctor'>
          <Button variant="text">I'm a doctor</Button>
        </Link>
      </Box>
      <Outlet />
    </Container>
  )
}