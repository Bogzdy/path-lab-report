import DisplayReportComponent from '../../components/DisplayReportComponent'
import { useParams } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";
import {useState} from 'react'
import Loading from '../../components/Loading'


export default function ViewReport(props){
    const { id } = useParams()
    const {reports} = useOutletContext()
    const [report, setReport] = useState(() => reports.find(report => report.id == id))
    const [patient, setPatient] =useState(()=> props.patients.find((patient)=> patient.id == report.patient ))


    return(
        <DisplayReportComponent
            isEditable={false}
            patients={props.patients}
            patient={patient}
            report={report}
            isNewReport={false}
        />
    )
}