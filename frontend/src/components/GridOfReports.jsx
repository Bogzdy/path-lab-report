import { Grid, Typography } from '@mui/material';
import CardComponent from './CardComponent';
import { useOutletContext } from "react-router-dom";
import { useResourceContext } from '../App'
import Loading from './Loading'


export default function GridOfReports(props) {
    const { reports, isEachReportLoading } = useOutletContext()
    const { patients, isEachPatientLoading } = useResourceContext()

    if (isEachPatientLoading || isEachReportLoading) return <Loading />
    return (
        <>
            {reports
                ? <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                    {
                        reports.map((element, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <CardComponent report={element} patients={patients} />
                            </Grid>
                        ))
                    }
                </Grid>
                : <Typography variant='h4' align='center'>No reports</Typography>
            }
        </>
    )
}