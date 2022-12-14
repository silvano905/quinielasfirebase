import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectUser, updateFreeQuantity} from "../../redux/user/userSlice";
import {selectJornada, selectNextJornada} from "../../redux/jornadas/jornadasSlice";
import BuyQuinielaForm from "../../components/quinielas/BuyQuinielaForm";
import QuinielaComp from "../../components/quinielas/QuinielaComp";
import GetFreeQuinielasComponent from "../../components/quinielas/BuyingQuinielasChecker";
import {Link, useNavigate} from "react-router-dom";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import {getCart, selectCart} from "../../redux/cart/cartSlice";
import {getMyQuinielas, selectMyQuinielas} from "../../redux/quinielas/quinielasSlice";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import {collection, doc, getDocs, orderBy, query, updateDoc, where} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import ReactGA from "react-ga4";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";
import {selectPromotions} from "../../redux/promotions/promotionsSlice";
import {selectPrice} from "../../redux/price/priceSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:'12px auto 2px auto'
}));

const ItemTwo = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    height: 80,
    color: theme.palette.text.secondary,
    lineHeight: '60px',
}));

const ItemThree = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    background: "linear-gradient(45deg, #4ea8de 8%, #5e60ce 80%)",
    height: 110,
    color: 'white',
    lineHeight: '60px',
    marginTop: 12,
    marginBottom: 10
}));

function BuyQuinielas() {
    const quinielaPrice = useSelector(selectPrice)
    const nextJornada = useSelector(selectNextJornada)
    const promo = useSelector(selectPromotions)
    const myQuinielas = useSelector(selectMyQuinielas)
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)
    let userCountryPrice = 0
    const currentJornada = useSelector(selectJornada)
    const navigate = useNavigate()

    const dispatch = useDispatch()
    useEffect(() => {
        if(user.user&&nextJornada){
            if(user.userData.country==='México'){
                userCountryPrice = 30
            }else {
                userCountryPrice = 2
            }
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

        cartList = myCart.map(item =>{
            return(
                <>
                    <QuinielaComp game={item.data} showDelete='true' id={item.id}/>
                </>
            )
        })
    }
    //end

    //this function is to set the price for the Quinileas based on the users country
    function SetQuinilasPrice() {
        let price = ''
        if(user.user){
            if(myCart&&user.userData.freeQuantity>=myCart.length&&myCart.length>0){
                if(user.userData.country==='México'){
                    price = '$0 Pesos'
                }else {
                    price = "$0 Dólares"
                }
            }
            if(myCart&&user.userData.freeQuantity>=myCart.length&&myCart.length<=0){
                if(user.userData.country==='México'){
                    price = '$0 Pesos'
                }else {
                    price = "$0 Dólares"
                }
            }
            if(myCart&&user.userData.freeQuantity<myCart.length&&myCart.length>0){
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
                        presione para obtener tus quinielas gratis
                    </Typography>
                    <GetFreeQuinielasComponent/>
                </>

            )
        }

    }
    //end GetFreeQuinielasButton

    if(nextJornada&&nextJornada.openToBuy){
        return (
            <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item>
                            <Grid container spacing={1} justifyContent="center">
                                <Grid item sm={10} lg={10} xs={10}>
                                    <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                        Quinielas Agregadas
                                    </Typography>
                                    <Divider>
                                        <ShoppingCartIcon/>
                                    </Divider>
                                </Grid>
                                <Grid item sm={10} lg={10} xs={10}>
                                    <Typography variant="h6" component="div" gutterBottom style={{color: 'black'}}>
                                        Jornada <span style={{color:"blue", fontSize: 23}}>{nextJornada.jornadaNumber}</span> empieza el {nextJornada.startDate}
                                    </Typography>
                                </Grid>

                                <Grid item sm={10} lg={10} xs={5}>
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

                                <Grid item sm={10} lg={10} xs={5}>
                                    <ItemTwo elevation={6}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            Precio Total
                                        </Typography>
                                        <Divider variant="middle" />
                                        <SetQuinilasPrice/>
                                    </ItemTwo>
                                </Grid>

                                {promo&&
                                    <Grid item sm={10} lg={10} xs={10}>
                                        <ItemThree elevation={6}>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                Promoción
                                            </Typography>
                                            <Divider variant="middle" />
                                            <Typography variant="h6" component="div" gutterBottom>
                                                si compras {promo.data.buy} quinielas recibes {promo.data.free} gratis
                                            </Typography>
                                        </ItemThree>
                                    </Grid>
                                }

                                <Grid item sm={10} lg={12} xs={10}>
                                    <Accordion style={{color: '#495057'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon style={{color: "blue"}}/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h6" gutterBottom>Quinielas Gratis: {user.user&&user.userData.freeQuantity}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                Puedes recibir 5 quinielas gratis si invitas a un amigo a jugar. Tu amigo tiene que comprar un minimo de 2 quinielas.
                                            </Typography>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                Al comprar las quinielas tu amigo tiene que ingresar tu cupon de usuario que es el: <span style={{color: "#005aff"}}>{user.user&&user.userData.userCouponCode}</span>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <GetFreeQuinielasButton/>

                                {myCart&&myCart.length?
                                    <Grid item sm={10} lg={10} xs={10}>
                                        <Button style={{margin: '5px auto 5px auto', color: "black"}} onClick={() => setShowQuinielas({...showQuinielas, show: !show})}
                                                variant="outlined">
                                            ver quinielas agregadas <KeyboardDoubleArrowDownIcon/>
                                        </Button>
                                    </Grid>
                                    :
                                    null
                                }
                            </Grid>

                            {show?
                                <Grid  container spacing={1} justifyContent="center">
                                    <Grid item sm={12} lg={10} xs={12}>
                                        {cartList}
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                        </Item>
                    </Grid>
                    <BuyQuinielaForm game={nextJornada} user={user}/>
                </Grid>
            </Box>
        );
    }else {
        return (
            <>
                <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={11} lg={7} xs={11}>
                            <Item>
                                <Badge color="primary" style={{margin: '20px auto 5px auto'}}>
                                    <CancelIcon color="action"/>
                                </Badge>
                                <Typography variant="h5" component="div" gutterBottom style={{margin: 5}}>
                                    Por favor espara hasta que comience la proxima jornada
                                </Typography>

                                <Typography variant="h5" component="div" gutterBottom style={{margin: 5, color: 'blue'}}>
                                    Puedes comprar quinielas de lunes a jueves
                                </Typography>

                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }


}

export default BuyQuinielas;