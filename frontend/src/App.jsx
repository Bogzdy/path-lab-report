import useCustomAxios from './auth/useCustomAxios'
import Reports from './routes/reports/Reports'
import ViewReport from './routes/search/ViewReport'
import Home from './routes/home/Home'
import ListOfReports from './routes/reports/ListOfReports'
import Statistics from './routes/statistics/Statistics'
import Login from './routes/login/Login'
import Report from './routes/reports/Report'
import NewReport from './routes/reports/NewReport'
import Search from './routes/search/Search'
import Account from './routes/login/Account'
import { GET_PATIENTS_URL } from './constants/urls'
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from 'react'
import { RequireAuth, useAuthContext } from './auth/AuthContext'
import AppBar from './components/AppBar'
import GridOfReports from './components/GridOfReports'
import Register from './routes/login/Register'
import RegisterComponent from './components/RegisterComponent'

const ResourceContext = createContext()

export function useResourceContext() {
    return useContext(ResourceContext)
}

export default function App(props) {
    const { logout, user } = useAuthContext()
    const customAxios = useCustomAxios()
    const [patients, setPatients] = useState([])
    const [isEachPatientLoading, setIsEachPatientLoading] = useState(true)

    const getPatients = () => {
        setIsEachPatientLoading(true)
        customAxios.get(GET_PATIENTS_URL)
            .then((response) => {
                setPatients(response.data)
            })
            .catch(e => {
                setIsEachPatientLoading(false)
                console.log(e)
            })

    }

    const getPatient = async () => {
        setIsEachPatientLoading(true)
        customAxios.get(`${GET_PATIENTS_URL}${user.userId}`)
            .then((response) => {
                setPatients([{ ...response.data }])
            })
            .catch(e => {
                setIsEachPatientLoading(false)
                console.log(e)
            })

    }

    useEffect(() => {
        if (user.userId !== null) {
            user.isStaff ? getPatients() : getPatient()
        }
    }, [user])

    useEffect(() => {
        setIsEachPatientLoading(false)
    }, [patients])

    const context = {
        isEachPatientLoading,
        setIsEachPatientLoading,
        patients,
        getPatients
    }

    return (
        <ResourceContext.Provider value={context}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path='/register' element={<Register />} >
                    <Route path=':type' element={<RegisterComponent />} />
                    {/*                 <Route path='doctor' element={<DoctorFormComponent/>} /> */}
                </Route>
                <Route path="/" element={
                    <RequireAuth>
                        <AppBar logout={logout} />
                    </RequireAuth>
                }>
                    <Route path="" element={<Home />} />
                    <Route path="/account" element={<Account />} />
                    <Route path='/reports' element={
                        <RequireAuth>
                            <Reports />
                        </RequireAuth>
                    }>
                        <Route path='' element={<ListOfReports />} />
                        <Route path='add' element={<NewReport patients={patients} getPatients={getPatients} />} />
                        <Route path=':id' element={<Report patients={patients} />} />
                    </Route>
                    <Route path='/search' element={<Search />} >
                        <Route path='found' element={<GridOfReports patients={patients} />} />
                        <Route path='found/:id' element={<ViewReport patients={patients} />} />
                    </Route>
                    <Route path='/statistics' element={<Statistics />} />
                </Route>
            </Routes>
        </ResourceContext.Provider>
    )
}
