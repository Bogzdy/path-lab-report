import ReportFormComponent from '../../components/ReportFormComponent'
import { useOutletContext } from "react-router-dom";
import React, { useEffect } from 'react';

export default function NewReport(props) {
    const { getAccountReports } = useOutletContext()

    useEffect(() => {
        return () => {
            getAccountReports()
        }
    }, [])

    return (
        <ReportFormComponent
            isNewReport
            patients={props.patients}
            getPatients={props.getPatients}
        />
    )
}
