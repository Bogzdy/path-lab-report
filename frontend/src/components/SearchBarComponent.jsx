import { useState, useEffect } from 'react'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Grid } from '@mui/material';
import { Button, Checkbox, TextField, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import useCustomAxios from '../auth/useCustomAxios'
import { useAuthContext } from '../auth/AuthContext'
import GridOfReports from './components/GridOfReports'

const queryParams = [
    { name: 'First Name', param: 'patient_first_name' },
    { name: 'Last Name', param: 'patient_last_name' },
    { name: 'Gross exam', param: 'gross_exam' },
    { name: 'Microscopic exam', param: 'microscopic_exam' },
    { name: 'Immunohistochemistry exam', param: 'immuno_examination' },
    { name: 'Special stains', param: 'special_stain_exam' },
    { name: 'Diagnosis', param: 'diagnosis' },
    { name: 'Medical codes', param: 'medical_codes' },
    { name: 'Topography codes', param: 'topography_codes' }
]
export default function Search(props) {
    const [selectedParams, setSelectedParams] = useState([])
    const [params, setParams] = useState()
    const [isEachReportYours, setIsEachReportYours] = useState(false)
    const { user } = useAuthContext()

    const handleFilterChange = (event, value) => {
        setSelectedParams(value)
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
        isEachReportYours ? updatedParam['doctor'] = user.userId : updatedParam['doctor'] = null
        setParams(param => ({
            ...param,
            ...updatedParam
        }))
    }, [isEachReportYours])

    const handleOnBlur = (e) => {
        getFilteredReports()
    }

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

                <Grid item sm={4} md={4} lg={4} direction='column'>
                    <Grid item sm={12}>
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            size='small'
                            options={queryParams}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.name}
                            onChange={handleFilterChange}
                            onBlur={handleOnBlur}
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
                    <Grid item sm={12} md={12} lg={12} >
                        <FormControlLabel
                            control={<Switch checked={isEachReportYours} onChange={() => setIsEachReportYours(!isEachReportYours)} />}
                            label="Your reports"
                        />
                    </Grid>
                    <Grid item sm={12} md={12} lg={12} >
                        <Button variant="contained" >Contained</Button>
                    </Grid>
                </Grid>
            </Grid>
            <GridOfReports patients={props.patients} reports={reports} />
        </div>
    );


}