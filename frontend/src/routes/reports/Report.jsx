import ReportFormComponent from '../../components/ReportFormComponent'
import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Report(props) {
    const { id } = useParams()
    const { reports } = useOutletContext()
    const [report, setReport] = useState(() => reports.find(report => report.id == id))
    const { getAccountReports } = useOutletContext()

    useEffect(() => {
        return () => {
            getAccountReports()
        }
    }, [])

    return (
        <ReportFormComponent
            report={report}
            patients={props.patients}
        />
    )
}