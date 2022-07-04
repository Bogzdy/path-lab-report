import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";


const paragraphLength = 50

export default function CardComponent(props) {
  const navigate = useNavigate()
  const handleViewButton = (e) => {
    navigate(`./${props.report.id}`)
  }

  return (
    <Card variant="outlined">
      <React.Fragment>
        <CardContent>
          <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
            {props.report.patient ?
              `${props.patients.find(patient => patient.id == props.report.patient)?.last_name}
                  ${props.patients.find(patient => patient.id == props.report.patient)?.first_name}` :
              '\n'}
          </Typography>
          <Typography variant="string" sx={{ fontSize: 14 }} component="div" gutterBottom>
            {props.report.gross_exam &&
              props.report.gross_exam.length > paragraphLength ?
              props.report.gross_exam.slice(0, paragraphLength) :
              props.report.gross_exam}
          </Typography>
          <Typography variant="string" sx={{ fontSize: 14 }} color="text.secondary" component="div" gutterBottom>
            {props.report.microscopic_exam &&
              props.report.microscopic_exam.length > paragraphLength ?
              props.report.microscopic_exam.slice(0, paragraphLength) :
              props.report.microscopic_exam}
          </Typography>
          <Typography variant="string" sx={{ fontSize: 14 }}>
            {props.report.diagnosis &&
              props.report.diagnosis.length > paragraphLength ?
              props.report.diagnosis.slice(0, paragraphLength) :
              props.report.diagnosis}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleViewButton}>View</Button>
        </CardActions>
      </React.Fragment>
    </Card>
  );
}
