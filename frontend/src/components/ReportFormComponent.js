import React, { useState } from 'react';
import { useAuthContext } from '../auth/AuthContext'
import useCustomAxios from '../auth/useCustomAxios'
import { PATCH_REPORT_URL, POST_REPORT_URL } from '../constants/urls';
import DisplayReportComponent from './DisplayReportComponent'



function ReportFormComponent(props) {
    const customAxios = useCustomAxios()
    const { user } = useAuthContext()
    const doctor = { 'doctor': user.userId }
    const [dialogOpen, setDialogOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState()
    const [alertSeverity, setAlertSeverity] = useState()
    const [report, setReport] = useState(props?.report ? props.report : { ...doctor })
    const [patient, setPatient] = useState(props?.report ? props.patients.find((patient) =>
        patient.id == report.patient) : null)


    const handleChange = (e) => {
        let updatedReport = {}
        updatedReport[e.target.id] = e.target.value
        setReport(report => ({
            ...report,
            ...updatedReport
        }))
    }

    const handlePatientSelect = (event, value) => {
        setReport({ ...report, patient: value?.id })
        setPatient(value?.id)

    }

    const handleOnBlur = function () {
        // if report has only 'doctor' property -> return (don't perform database request)
        if (Object.keys(report).length <= 1 && Object.keys(report).includes('doctor')) return
        // if report has id -> PATCH else -> POST
        if (report.id) {
            customAxios.patch(`${PATCH_REPORT_URL}/${report.id}`, { ...report })
                .then(response => {
                    console.log(response)
                    if (response.status === 200) {
                        setAlertMessage('Report has been updated')
                        setAlertSeverity('success')
                        setOpenAlert(true)
                    }
                })
                .catch(e => {
                    setAlertMessage('Something went wrong!')
                    setAlertSeverity('error')
                    setOpenAlert(true)
                })

        } else {
            customAxios.post(POST_REPORT_URL, { ...report })
                .then(response => {
                    console.log(response)
                    setReport(report => ({
                        ...report,
                        "id": response.data.id
                    }))
                    if (response.status == 201) {
                        setAlertMessage('Report has been created')
                        setAlertSeverity('success')
                        setOpenAlert(true)
                    }
                })
                .catch(e => {
                    setAlertMessage('Something went wrong!')
                    setAlertSeverity('error')
                    setOpenAlert(true)
                })
        }

    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') return
        setOpenAlert(false)
    }

    const handleNewPatientButton = () => setDialogOpen(true)

    const handleCloseDialog = () => {
        // getPatients from database
        props.getPatients()
        // close dialog window
        setDialogOpen(false)
    }

    return (
        <>
            <DisplayReportComponent
                isEditable={user.isStaff ? true : false}
                handleOnBlur={handleOnBlur}
                handleChange={handleChange}
                isNewReport={props.isNewReport}
                alertSeverity={alertSeverity}
                alertMessage={alertMessage}
                dialogOpen={dialogOpen}
                handleCloseDialog={handleCloseDialog}
                openAlert={openAlert}
                handleCloseAlert={handleCloseAlert}
                handlePatientSelect={handlePatientSelect}
                patients={props.patients}
                patient={patient}
                report={report}
                handleNewPatientButton={handleNewPatientButton}
            />
        </>
    )
}

export default ReportFormComponent
