import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import histo from "../../images/histo.jpg"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function Home(props) {

    return (
        <Container maxWidth='md'>
            <Typography align='center' variant="h4" gutterBottom component="div">
                COOL WELCOME PAGE
            </Typography>
            <ImageList sx={{ width: "100%", height: "auto" }} cols={1}>
                <ImageListItem>
                    <img
                    src={histo}
                    alt="histology"
                    />
                </ImageListItem>
            </ImageList>
        </Container>
    )
}
