import React, {Fragment, useEffect, useState, useRef} from 'react';
import PaypalButton from "./ButtonComponent";
import {useNavigate} from "react-router-dom"
import { useSelector,useDispatch } from 'react-redux';
import {selectCart} from "../../redux/cart/cartSlice";
import {selectUser} from "../../redux/user/userSlice";
import {collection, getDocs, orderBy, query, where, updateDoc, doc} from "firebase/firestore";
import {db} from '../../config-firebase/firebase'
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: 60,
    paddingBottom: 8
}));

const Paypal = ({code}) => {
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const paypalRef = useRef();
    const navigate = useNavigate()
    if (user.user) {
        return (

            <Fragment>
                <div style={{flexFlow: 1}}>
                    <Grid container spacing={0}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} sm={11} lg={5}>
                                <Item>
                                    <div>
                                        {error && <div>Uh oh, an error occurred! {error.message}</div>}
                                        <Typography variant="h6" component="h6">
                                            Paga de forma segura con Paypal
                                        </Typography>
                                        <PaypalButton code={code}/>
                                    </div>
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Fragment>

        );
    }else {
        return (
            <p>nothing</p>
        )
    }


}


export default Paypal;