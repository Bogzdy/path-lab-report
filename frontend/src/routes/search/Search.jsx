import { useState, useEffect } from 'react'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Grid, DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog } from '@mui/material';
import { Button, Checkbox, TextField, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import useCustomAxios from '../../auth/useCustomAxios'
import { GET_FILTERED_REPORTS } from '../../constants/urls'
import { useAuthContext } from '../../auth/AuthContext'
import GridOfReports from '../../components/GridOfReports'
import { Outlet, useNavigate } from "react-router-dom";
import Loading from '../../components/Loading'


const queryParams = [
    { name: 'First Name', param: 'patient_first_name', value: null },
    { name: 'Last Name', param: 'patient_last_name', value:null },
    { name: 'Gross exam', param: 'gross_exam', value:null },
    { name: 'Microscopic exam', param: 'microscopic_exam', value:null },
    { name: 'Immunohistochemistry exam', param: 'immuno_examination', value:null },
    { name: 'Special stains', param: 'special_stain_exam', value:null },
    { name: 'Diagnosis', param: 'diagnosis', value:null },
    { name: 'Medical codes', param: 'medical_codes', value:null },
    { name: 'Topography codes', param: 'topography_codes', value:null }
]

const q = {
    patient_first_name:{
        name: 'First Name',
        value: null
    },
    patient_last_name_name:{
        name: 'Last Name',
        value: null
    },
    gross_exam:{
        name: 'Gross exam',
        value: null
    },
    microscopic_exam:{
        name: 'Microscopic exam',
        value: null
    },
    immuno_examination:{
        name: 'Immunohistochemistry',
        value: null
    },
    special_stain_exam:{
        name: 'Special stains',
        value: null
    },
    diagnosis:{
        name: 'Diagnosis',
        value: null
    },
    medical_codes:{
        name: 'Medical codes',
        value: null
    },
    topography_codes:{
        name: 'Topography codes',
        value: null
    }
}

export default function Search(props) {
    const { user } = useAuthContext()
    const customAxios = useCustomAxios()
    const [selectedParams, setSelectedParams] = useState([])
    const [params, setParams] = useState()
    const [isEachReportYours, setIsEachReportYours] = useState(false)
    const [reports, setReports] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleFilterChange = (event, object, reason) => {
        if (reason == 'removeOption') {
            let removedParam = selectedParams.filter(param => !object.includes(param)).at(0)
            let updatedParam = {}
            updatedParam[removedParam.param] = null
            setParams(params => ({
                ...params,
                ...updatedParam
            }))
        }
        setSelectedParams(object)
    }

    const getFilteredReports = () => {
        setIsLoading(true)
        customAxios.get(GET_FILTERED_REPORTS, { params: params })
            .then(response => {
                setReports(response.data)
                navigate('./found')
            })
            .catch(e => console.log(e))
            .finally(() => setIsLoading(false))
    }

    const handleParamsOnChange = (e) => {
        let updatedParam = {}
        updatedParam[e.target.id] = e.target.value
        setParams(param => ({
            ...param,
            ...updatedParam
        }))
    }

    useEffect(() => {
        let updatedParam = {}
        isEachReportYours ? updatedParam['doctor_id'] = user.userId : updatedParam['doctor_id'] = null
        setParams(param => ({
            ...param,
            ...updatedParam
        }))
    }, [isEachReportYours])

    const context = { reports }

    return (
        <div>
            <Grid container maxWidth={1} p={1} spacing={1} margin={1}>
                <Grid container sm={8} md={8} lg={8} spacing={1}>
                    {selectedParams.map((param) =>
                        <Grid item sm={3} md={3} lg={3}>
                            <TextField
                                id={param.param}
                                label={param.name}
                                size="small"
                                onChange={handleParamsOnChange}
                            />
                        </Grid>
                    )}
                </Grid>

                <Grid container sm={4} md={4} lg={4} direction='row' spacing={1}>
                    <Grid item sm={12}>
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            size='small'
                            options={queryParams}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.name}
                            onChange={handleFilterChange}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.name}
                                </li>
                            )}

                            renderInput={(params) => (
                                <TextField {...params} label="Filters" placeholder="Add filters" />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={6} lg={6} >
                        <FormControlLabel
                            control={<Switch checked={isEachReportYours} onChange={() => setIsEachReportYours(!isEachReportYours)} />}
                            label="Your reports"
                        />
                    </Grid>
                    <Grid item sm={6} md={6} lg={6} >
                        <Button variant="contained" onClick={getFilteredReports}>SEARCH</Button>
                    </Grid>
                </Grid>
            </Grid>
            {
            isLoading
            ? <Loading/>
            : <Outlet context={context} />
            }
        </div>
    );
}