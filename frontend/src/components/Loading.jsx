import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading(props) {

    return(
    <Box
          sx={{
          maxWidth:'100%',
          minHeight: '90vh',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          p: 1,
          m: 1}}
    >
      <CircularProgress />
    </Box>
    )
}