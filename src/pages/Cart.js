import React, {Fragment, useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {Link, Redirect} from "react-router-dom";
import QuinielaComp from "../components/quinielas/QuinielaComp";


import {getCart, selectCart} from "../redux/cart/cartSlice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Paypal from "../components/payment/Paypal";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from "@mui/material/Divider";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../config-firebase/firebase";
import {getMyQuinielas} from "../redux/quinielas/quinielasSlice";
import {selectJornada, selectNextJornada} from "../redux/jornadas/jornadasSlice";
import {selectUser} from "../redux/user/userSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 10,
    background: '#fdfffc',
    margin: '15px auto 5px auto'
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: '#11468F',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    width: 80,
    margin: '5px auto 5px auto'
}));


const Cart = () => {
    const nextJornada = useSelector(selectNextJornada)
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)

    //close and open cart list
    const [showQuinielas, setShowQuinielas] = useState({
        show: false,
    });
    const {show} = showQuinielas;
    //end

    const [formData, setFormData] = useState({
        showSquare: false,
        showPaypal: false,
        showBitcoin: false
    });

    //react hooks
    const dispatch = useDispatch()

    useEffect(() => {
        let p = collection(db, 'quinielas')
        let order = query(p, orderBy('timestamp', 'desc'),
            where("userId", "==", user.uid),
            where("fiveDigitId", "==", nextJornada.id),
            where("paid", "==", false),)
        const querySnapshot = getDocs(order).then(x=>{
            dispatch(getCart(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })
    }, []);

    const {showPaypal, showSquare, showBitcoin} = formData

    let cartList
    if(myCart) {

        // if(myCart.length<=0){
        //     return <Redirect to="/my-quinielas" />;
        // }

        cartList = myCart.map(item =>{
            return(
                <>
                    <QuinielaComp game={item.data}/>
                </>
            )
        })



        return (

            <Box sx={{ flexGrow: 1 }}>
                <Grid  container spacing={1} justifyContent="center">
                    <Grid item sm={9} lg={10} xs={11}>
                        <Item elevation={6}>
                            <Typography variant="h5" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                compra total
                            </Typography>
                            <div style={{margin: 10}}>
                                <Divider>
                                    <ShoppingCartIcon/>
                                </Divider>
                            </div>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Grid item sm={6} lg={6} xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Quinielas
                                    </Typography>
                                </Grid>

                                <Grid item sm={6} lg={6} xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        {myCart.length}
                                    </Typography>
                                </Grid>

                                <Grid item sm={6} lg={6} xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item sm={6} lg={6} xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        ${myCart.length*2}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12} lg={9} xs={12}>
                                    <Typography variant="h5" gutterBottom style={{color: "blue"}}>
                                        Elige un método de pago
                                    </Typography>
                                </Grid>
                                {/*<Grid item sm={12} lg={9} xs={12}>*/}
                                {/*    <Button variant="contained" href="/buy" color="primary" style={{margin:'10px auto 10px auto'}}>*/}
                                {/*        agregar quinielas*/}
                                {/*    </Button>*/}
                                {/*</Grid>*/}

                                {show?
                                    <Grid item sm={12} lg={10} xs={12}>
                                        {cartList}
                                        <Button style={{margin: '5px auto 5px auto', color: "black"}} onClick={() => setShowQuinielas({...showQuinielas, show: !show})}
                                                variant="outlined">
                                            cerrar
                                        </Button>
                                    </Grid>
                                    :
                                    <Button style={{margin: '5px auto 5px auto', color: "black"}} onClick={() => setShowQuinielas({...showQuinielas, show: !show})}
                                            variant="outlined">
                                        ver quinielas agregadas
                                    </Button>
                                }

                            </Grid>
                        </Item>
                    </Grid>

                    <Grid item sm={9} lg={10} xs={11}>
                        <Paypal/>
                    </Grid>
                </Grid>
            </Box>
        );
    }else {
        return (
            <p>Loading...</p>
        )
    }





}

export default Cart;