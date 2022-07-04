import React from 'react';
import {useSelector} from 'react-redux';
import {selectAlerts} from "../../redux/alerts/alertsSlice";
//material ui imports
import Alert from '@mui/material/Alert';


const Alerts = () => {
    //get alerts from state /react hooks
    const alerts = useSelector(selectAlerts);

    //return alerts if not null and greater than 0
    if(alerts){
        return (
            <Alert severity={alert.alertType} key={alert.id}>
                {alerts}
            </Alert>
        )
    }
}

export default Alerts;
