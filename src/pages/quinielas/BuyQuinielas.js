import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/user/userSlice";
import {selectJornada, selectNextJornada} from "../../redux/jornadas/jornadasSlice";
import BuyQuinielaForm from "../../components/quinielas/BuyQuinielaForm";
import QuinielaComp from "../../components/quinielas/QuinielaComp";
import {Link} from "react-router-dom";
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
import {selectMyQuinielas} from "../../redux/quinielas/quinielasSlice";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import ReactGA from "react-ga4";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:'12px auto 2px auto'
}));

function BuyQuinielas() {
    const nextJornada = useSelector(selectNextJornada)
    const myQuinielas = useSelector(selectMyQuinielas)
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)

    const dispatch = useDispatch()
    useEffect(() => {
        ReactGA.initialize('G-9ZG76GPGQF')
        if(user){
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
                                {myCart&&myCart.length?
                                    <Grid item sm={10} lg={10} xs={10}>
                                        <Typography variant="h6" component="div" gutterBottom style={{color: '#004e98'}}>
                                            {myCart.length}
                                        </Typography>
                                    </Grid>
                                    :
                                    null
                                }
                                {myCart&&
                                    <Grid item sm={10} lg={10} xs={10}>
                                        <Typography variant="h6" component="div" gutterBottom style={{color: '#004e98'}}>
                                            ${myCart.length*2}.00
                                        </Typography>
                                    </Grid>
                                }

                                {/*{myQuinielas?*/}
                                {/*    <Grid item sm={10} lg={10} xs={10}>*/}
                                {/*        <Typography variant="h6" component="div" gutterBottom style={{color: 'green'}}>*/}
                                {/*            {myQuinielas.length} quinielas pagadas*/}
                                {/*        </Typography>*/}
                                {/*    </Grid>*/}
                                {/*    :*/}
                                {/*    null*/}
                                {/*}*/}
                                <Grid item sm={10} lg={10} xs={10}>
                                    {myCart&&myCart.length>0?
                                        // <Button variant="contained" href="/cart" color="primary" style={{margin:'8px auto 5px auto'}}>
                                        //     pagar quinielas
                                        // </Button>
                                        <Link to='/cart' style={{color: 'white', textDecoration: 'none'}}>
                                            <Button size="large" variant="contained" style={{backgroundColor: '#343a40', color:'white', margin: '0 3px 0 0'}}>pagar quinielas</Button>
                                        </Link>
                                        :
                                        null
                                    }
                                </Grid>
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