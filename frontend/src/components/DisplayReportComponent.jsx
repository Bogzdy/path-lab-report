import {
    TextField, Container, Divider, Grid, FormControl,
    MenuItem, Select, InputLabel, Button, Autocomplete
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import UserFormComponent from './UserFormComponent';
import React from 'react'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const labels = {
    "gross_exam": {
        "label": "Gross examination",
        "id": "gross_exam"
    },
    "microscopic_exam": {
        "label": "Microscopic examination",
        "id": "microscopic_exam"
    },
    "immuno_examination": {
        "label": "Immunohistochemical stain examination",
        "id": "immuno_examination"
    },
    "special_stain_exam": {
        "label": "Special stain examination",
        "id": "special_stain_exam"
    },
    "diagnosis": {
        "label": "Diagnosis",
        "id": "diagnosis"
    },
    "medical_codes": {
        "label": "Medical codes",
        "id": "medical_codes"
    },
    "topography_codes": {
        "label": "Topography codes",
        "id": "topography_codes"
    },
    "patient": {
        "label": "Patient",
        "id": "patient"
    }
}

export default function DisplayReportComponent (props) {
    const isEditable = props.isEditable
    const handleChange = isEditable ? props.handleChange : null
    const handleOnBlur = isEditable ? props.handleOnBlur : null
    const defaultProps = {
        options: props.patients,
        getOptionLabel: (option) => option?.username
    }

    return(
        <Container maxWidth="md" style={{ marginBottom: 200 }}>
            {isEditable && <>
            <UserFormComponent
                dialogOpen={props.dialogOpen}
                handleCloseDialog={props.handleCloseDialog}
            />
            <Snackbar open={props.openAlert} autoHideDuration={2000} onClose={props.handleCloseAlert}>
                <Alert onClose={props.handleCloseAlert} severity={props.alertSeverity} sx={{ width: '100%' }}>
                    {props.alertMessage}
                </Alert>
            </Snackbar>
            </>}
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={4}>
                    <Autocomplete
                        disabled={!isEditable}
                        onChange={props.handlePatientSelect}
                        onBlur={(props.patient) && props.handleOnBlur}
                        {...defaultProps}
                        id="auto-complete"
                        defaultValue={props.patient}
                        autoComplete
                        includeInputInList
                        renderInput={(params) => (
                            <TextField {...params} label="Patient" variant="standard" />
                        )}
                    />
                </Grid>
                {
                    props.isNewReport &&
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            onClick={props.handleNewPatientButton}>
                            NEW PATIENT
                        </Button>
                    </Grid>
                }

            </Grid>
            <div style={{ marginTop: 20 }} >
                <TextField
                    disabled={!isEditable}
                    id={labels.gross_exam.id}
                    label={labels.gross_exam.label}
                    fullWidth
                    multiline
                    minRows='4'
                    maxRows='8'
                    value={props.report?.gross_exam}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                />
            </div>
            <div style={{ marginTop: 20 }} >
                <TextField
                    disabled={!isEditable}
                    id={labels.microscopic_exam.id}
                    label={labels.microscopic_exam.label}
                    fullWidth
                    multiline
                    minRows='4'
                    maxRows='8'
                    value={props.report?.microscopic_exam}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                />
            </div>
            <div style={{ marginTop: 20 }} >
                <TextField
                    disabled={!isEditable}
                    id={labels.immuno_examination.id}
                    label={labels.immuno_examination.label}
                    fullWidth
                    multiline
                    minRows='4'
                    maxRows='8'
                    value={props.report?.immuno_examination}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                />
            </div>
            <div style={{ marginTop: 20 }} >
                <TextField
                    disabled={!isEditable}
                    id={labels.special_stain_exam.id}
                    label={labels.special_stain_exam.label}
                    fullWidth
                    multiline
                    minRows='4'
                    maxRows='8'
                    value={props.report?.special_stain_exam}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                />
            </div>
            <div style={{ marginTop: 20 }} >
                <TextField
                    disabled={!isEditable}
                    id={labels.diagnosis.id}
                    label={labels.diagnosis.label}
                    fullWidth
                    multiline
                    minRows='4'
                    maxRows='8'
                    value={props.report?.diagnosis}
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                />
            </div>
            <div style={{ marginTop: 20 }} >
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <TextField
                            disabled={!isEditable}
                            id={labels.medical_codes.id}
                            label={labels.medical_codes.label}
                            fullWidth
                            multiline
                            minRows='1'
                            maxRows='2'
                            value={props.report?.medical_codes}
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            disabled={!isEditable}
                            id={labels.topography_codes.id}
                            label={labels.topography_codes.label}
                            fullWidth
                            multiline
                            minRows='1'
                            maxRows='2'
                            value={props.report?.topography_codes}
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                        />
                    </Grid>
                </Grid>
            </div>
        </Container>

    )
}