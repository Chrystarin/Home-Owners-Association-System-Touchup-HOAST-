import React,{useCallback, useEffect} from 'react'

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



// ****Implementation****

// Step 1 
// Initialize useState on the page
// const [openSnackBar, setOpenSnackBar] = React.useState({
//     open:false,
//     type:"",
//     note:""
// });

// Step 2 
//  Place this anywhere inside of the page
// {/* <SnackbarComp open={openSnackBar} setter={setOpenSnackBar}/> */}

// Step 3
// Update value usestate to call Snackbar
// setOpenSnackBar(openSnackBar => ({
//     ...openSnackBar,
//     open:true,
//     type:'success',
//     note:"Profile Updated!",
// }));

// Severity types = error,warning,info,success


function SnackbarComp(props) {
    
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    
    const onclose = useCallback(() => {
        props.setter(openSnackBar => ({
            ...openSnackBar,
            open:false,
            type:'info',
            note:""
        }));
    });
    return <>
        <Snackbar open={props.open.open} autoHideDuration={6000} onClose={onclose}>
            <Alert onClose={onclose} severity={props.open.type} sx={{ width: '100%' }}>
                {props.open.note}
            </Alert>
        </Snackbar>
    </>
}

export default SnackbarComp