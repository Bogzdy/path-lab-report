import React, { useEffect, useState } from 'react'
import { GET_ACCOUNT_REPORTS_URL } from '../../constants/urls'
import useCustomAxios from '../../auth/useCustomAxios'
import { Outlet } from "react-router-dom"

export default function Reports(props) {
    const [reports, setReports] = useState()
    const [isEachReportLoading, setIsEachReport] = useState(true)
    const customAxios = useCustomAxios()

    const getAccountReports = async () => {
        setIsEachReport(true)
        customAxios.get(GET_ACCOUNT_REPORTS_URL)
            .then((response) => {
                if (response.status === 200) {
                    setReports(response.data)
                }
            })
            .catch((e) => { console.log(e) })
            .finally(() => setIsEachReport(false))
    }

    useEffect(() => {
        getAccountReports()
    }, [])

    const context = { reports, getAccountReports, isEachReportLoading }

    return (
        <div>
            <Outlet context={context} />
        </div>

    );
}