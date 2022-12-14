import React, {Fragment, useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {Link, Redirect} from "react-router-dom";
import QuinielaComp from "../components/quinielas/QuinielaComp";

import GetFreeQuinielasComponent from "../components/quinielas/BuyingQuinielasChecker";
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
import {selectUser, setFriendCouponCode} from "../redux/user/userSlice";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import {selectPrice} from "../redux/price/priceSlice";

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

const ItemTwo = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    height: 80,
    color: theme.palette.text.secondary

}));
const Cart = () => {

    //TODO
    //1)(DONE) make cart page available to guests (non-user)
    //2) add payment secure logos
    //3) add total quinielas bought this jornada
    //4) add youtube video on how to pay with paypal
    //5) look at different websites checkout pages for inspiration
    //6)(DONE) make the code cleaner with comments
    //7)(DONE) add alerts when payment was unsuccessful
    //8)(DONE) add a promotion for buy 4 quinielas get 3 free
    //9)(DONE) add a promotionUsed to userData to make sure users don't over user friend coupon code
    //10) add how many free Quinielas the user is getting

    const quinielaPrice = useSelector(selectPrice)
    const dispatch = useDispatch()
    const nextJornada = useSelector(selectNextJornada)
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)

    useEffect(() => {
        if(user.user){
            let p = collection(db, 'quinielas')
            let order = query(p, orderBy('timestamp', 'desc'),
                where("userId", "==", user.user.uid),
                where("fiveDigitId", "==", nextJornada.fiveDigitId),
                where("paid", "==", false),)
            const querySnapshot = getDocs(order).then(x=>{
                dispatch(getCart(
                    x.docs.map(doc => ({data: doc.data(), id: doc.id}))
                ))
            })
        }

    }, []);


    //close and open cart list
    const [showQuinielas, setShowQuinielas] = useState({
        show: false,
    });
    const {show} = showQuinielas;

    let cartList
    if(myCart) {
        cartList = myCart.map(item => {
            return (
                <>
                    <QuinielaComp game={item.data}/>
                </>
            )
        })
    }
    //end


    //this is for the coupon code
    //the referred friend will get 5 free Quinielas
    const [coupon, setCoupon] = useState({
        code: ''
    });

    const{code} = coupon

    const onChange = (e) =>
        setCoupon({ ...code, [e.target.name]: e.target.value });

    const addCouponCode = (e) => {
        e.preventDefault()
        dispatch(setFriendCouponCode(code))
    }
    //



    //this function is to set the price for the Quinileas based on the users country
    function SetQuinilasPrice() {
        let price = ''
        if(user.user){
            if(user.userData.freeQuantity>=myCart.length&&myCart.length>0){
                if(user.userData.country==='México'){
                    price = '$0 Pesos'
                }else {
                    price = "$0 Dólares"
                }
            }
            if(user.userData.freeQuantity>=myCart.length&&myCart.length<=0){
                if(user.userData.country==='México'){
                    price = '$0 Pesos'
                }else {
                    price = "$0 Dólares"
                }
            }
            if(user.userData.freeQuantity<myCart.length&&myCart.length>0){
                if(user.userData.country==='México'){
                    price = `$${myCart.length*quinielaPrice.data.priceMEX-user.userData.freeQuantity*quinielaPrice.data.priceMEX} Pesos`
                }else {
                    price = `$${myCart.length*quinielaPrice.data.priceUSD-user.userData.freeQuantity*quinielaPrice.data.priceUSD} Dólares`
                }
            }

        }else {
            price = "$0"
        }

        return <Typography variant="h6" component="div" gutterBottom>{price}</Typography>
    }
    //end setQuinileasPrice function


    //this function is to get free quinielas if user has received free quinileas from referred friends
    function GetFreeQuinielasButton() {
        if(myCart&&myCart.length>0&&myCart.length<=user.userData.freeQuantity){
            return(
                <>
                    <Typography variant="h6" gutterBottom style={{color: "blue", margin: '15px 10px 2px 5px'}}>
                        presione para obtener quinielas gratis
                    </Typography>
                    <GetFreeQuinielasComponent/>
                </>

            )
        }

    }
    //end GetFreeQuinielasButton

    return (

        <Box sx={{ flexGrow: 1 }}>
            <Grid  container spacing={1} justifyContent="center">
                <Grid item sm={9} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Typography variant="h5" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                            Compra Total
                        </Typography>
                        <div style={{margin: 10}}>
                            <Divider>
                                <ShoppingCartIcon/>
                            </Divider>
                        </div>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item sm={10} lg={10} xs={6}>
                                <ItemTwo elevation={6}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        Cantidad Total
                                    </Typography>
                                    <Divider variant="middle" />
                                    {myCart?
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {myCart.length}
                                        </Typography>
                                        :
                                        <Typography variant="h6" component="div" gutterBottom>
                                            0
                                        </Typography>
                                    }

                                </ItemTwo>
                            </Grid>

                            <Grid item sm={10} lg={10} xs={6}>
                                <ItemTwo elevation={6}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        Precio Total
                                    </Typography>
                                    <Divider variant="middle" />
                                    <SetQuinilasPrice/>
                                </ItemTwo>
                            </Grid>

                            <Grid item sm={11} lg={7} xs={10}>
                                <Accordion style={{marginTop: 15}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon style={{color: "black"}}/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6" gutterBottom>¿Te recomendó un amigo?</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="h5" gutterBottom style={{color: "blue"}}>
                                            Introduce el código de cupón de tu amigo
                                        </Typography>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic2"
                                                label="Cupón de Usuario"
                                                name="code"
                                                inputProps={{ maxLength: 4 }}
                                                value={code}
                                                onChange={onChange}
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                        <Button style={{margin: '5px auto 5px auto', color: "black"}} onClick={addCouponCode}
                                                variant="outlined" disabled={!user.user}>
                                            agregar
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>

                            </Grid>

                            <GetFreeQuinielasButton/>

                            {myCart&&show&&myCart.length>0?
                                <Grid item sm={12} lg={10} xs={12}>
                                    <Button style={{margin: '15px auto 5px auto', color: "black"}} onClick={() => setShowQuinielas({...showQuinielas, show: !show})}
                                            variant="outlined">
                                        cerrar
                                    </Button>
                                    {cartList}
                                </Grid>
                                :
                                myCart&&myCart.length>0?
                                    <Button style={{margin: '15px auto 5px auto', color: "black"}} onClick={() => setShowQuinielas({...showQuinielas, show: !show})}
                                            variant="outlined">
                                        ver quinielas agregadas
                                    </Button>
                                    :
                                    null
                            }

                        </Grid>
                    </Item>
                </Grid>

                {myCart&&myCart.length>0&&user.userData.freeQuantity<myCart.length&&
                    <Grid item sm={9} lg={10} xs={11}>
                        <Paypal code={code}/>
                    </Grid>
                }
            </Grid>
        </Box>
    );






}

export default Cart;