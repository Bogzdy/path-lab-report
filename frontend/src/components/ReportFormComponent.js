import React, { useState } from 'react';
import { useAuthContext } from '../auth/AuthContext'
import useCustomAxios from '../auth/useCustomAxios'
import { PATCH_REPORT_URL, POST_REPORT_URL, DELETE_REPORT_URL } from '../constants/urls';
import DisplayReportComponent from './DisplayReportComponent'
import { useNavigate } from "react-router-dom";


function ReportFormComponent(props) {
    const customAxios = useCustomAxios()
    const navigate = useNavigate()
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

    const handleDeleteReport = () => {
        customAxios.delete(`${DELETE_REPORT_URL}${report.id}`)
            .then(response => {
                if (response.status == 204){
                    setAlertMessage('Report has been deleted. Redirecting...')
                    setAlertSeverity('warning')
                    setOpenAlert(true)
                    setTimeout(() => {
                        navigate('/reports', {replace: true})
                    }, 2000)

                }
            })
            .catch(e => {
                console.log(e)
                setAlertMessage('Something went wrong!')
                setAlertSeverity('error')
                setOpenAlert(true)
            })
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
                handleDeleteReport={handleDeleteReport}
                patients={props.patients}
                patient={patient}
                report={report}
                handleNewPatientButton={handleNewPatientButton}
            />
        </>
    )
}

export default ReportFormComponent
