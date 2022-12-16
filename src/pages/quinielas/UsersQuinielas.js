import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectQuinielas, selectMyQuinielas, getQuinielas, getMyQuinielas} from "../../redux/quinielas/quinielasSlice";
import {selectJornada, selectNextJornada, selectJornadaId, selectNextJornadaId} from "../../redux/jornadas/jornadasSlice";
import QuinielaComp from "../../components/quinielas/QuinielaComp";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import {collection, getDocs, limit, orderBy, query, where, onSnapshot} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import {getJornada} from "../../redux/jornadas/jornadasSlice";
import {selectUser} from "../../redux/user/userSlice";
import Spinner from "../../components/spinner/Spinner";


//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:'15px auto 0px auto'
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextThree = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const UserQuinielas = () => {

    const userQuinielas = useSelector(selectMyQuinielas)
    const currentJornada = useSelector(selectJornada)
    const nextJornada = useSelector(selectNextJornada)
    const currentJornadaId = useSelector(selectJornadaId)
    const nextJornadaId = useSelector(selectNextJornadaId)
    const[jornadaFiveDigitId, setJornadaFiveDigitId] = useState(currentJornada.fiveDigitId)

    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    useEffect(() => {
        if(user.user){
            // let p = collection(db, 'quinielas')
            // let order = query(p, orderBy('timestamp', 'desc'),
            //     where("userId", "==", user.user.uid),
            //     where("paid", "==", true),
            //     where("fiveDigitId", "==", jornadaFiveDigitId))
            // onSnapshot(order, (snapshot) => {
            //     dispatch(
            //         getMyQuinielas(
            //             snapshot.docs.map(doc => (doc.data()))
            //         )
            //     )
            // })

            let p = collection(db, 'quinielas')
            let order = query(p, orderBy('timestamp', 'desc'),
                where("userId", "==", user.user.uid),
                where("paid", "==", true),
                where("fiveDigitId", "==", jornadaFiveDigitId))
            const querySnapshot = getDocs(order).then(x=>{
                dispatch(getMyQuinielas(
                    x.docs.map(doc => (doc.data()))
                ))
            })
        }
    }, [jornadaFiveDigitId]);


    let list
    if(userQuinielas){

        list = userQuinielas.map(item =>{
            return(
                <Grid item sm={11} lg={5} xs={11}>
                    <QuinielaComp game={item} showScore='true'/>
                </Grid>
            )
        })
    }

        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid  container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={10} xs={11}>
                        <Item elevation={6}>
                            <Grid container spacing={1} justifyContent="center">
                                <Grid item sm={10} lg={10} xs={10}>
                                    <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                        Mis Quinielas
                                    </Typography>
                                    <Divider>
                                        <SportsSoccerIcon/>
                                    </Divider>
                                    {/*<Typography variant="h5" component="div" gutterBottom style={{color: 'blue'}}>*/}
                                    {/*    Jornada {currentJornada.jornadaNumber}*/}
                                    {/*</Typography>*/}
                                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                        <Button variant={jornadaFiveDigitId===currentJornada.fiveDigitId?'contained':'outlined'} onClick={()=>setJornadaFiveDigitId(currentJornada.fiveDigitId)}>Jornada {currentJornada.jornadaNumber}</Button>
                                        {nextJornada&&nextJornada.fiveDigitId!==currentJornada.fiveDigitId&&
                                            <Button variant={jornadaFiveDigitId===nextJornada.fiveDigitId?'contained':'outlined'} onClick={()=>setJornadaFiveDigitId(nextJornada.fiveDigitId)}>Jornada {nextJornada.jornadaNumber}</Button>
                                        }
                                    </ButtonGroup>
                                </Grid>

                                <Grid item sm={10} lg={10} xs={10}>
                                    {userQuinielas?
                                        <>
                                            <Typography variant="h5" component="div" gutterBottom style={{color: '#004e98'}}>
                                                {userQuinielas.length} Quinielas Compradas
                                            </Typography>
                                        </>
                                        :
                                        null
                                    }
                                </Grid>

                                <Grid item sm={12} lg={12} xs={12}>
                                    <Accordion style={{background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)", color: 'whitesmoke'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h6" gutterBottom>Cantidad Ganada: ${user.userData?user.userData.balance:0} {user.userData&&user.userData.country==='México'?<span>Pesos</span>:<span>Dólares</span>}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                Uno de nuestros representantes lo llamará por teléfono cuando gane para pedirle su información.
                                            </Typography>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                Podemos enviarle el dinero con Wester Union o podemos depositar su dinero en su cuenta bancaria si vive en los Estados Unidos.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item sm={12} lg={12} xs={12}>
                                    <Accordion style={{background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)", color: 'whitesmoke'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h6" gutterBottom>Quinielas gratis: {user.userData?user.userData.freeQuantity:0}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                Puedes recibir 5 quinielas gratis si invitas a un amigo a jugar y comprar un minimo de 2 quinielas.
                                            </Typography>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                Al comprar las quinielas tu amigo tiene que ingresar tu cupon de usuario que es el: <span style={{color: "#ffba08"}}>{user.userData&&user.userData.userCouponCode}</span>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                <Grid item sm={12} lg={12} xs={12}>
                                    <Accordion style={{background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)", color: 'whitesmoke'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h6" gutterBottom>Amigos referidos: {user.userData?user.userData.totalReferredFriends:0}/5</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                Puedes referir un limite de 5 amigos.
                                            </Typography>
                                            <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                Cupon de usuario: <span style={{color: "#ffba08"}}>{user.userData&&user.userData.userCouponCode}</span>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>


                            </Grid>
                        </Item>
                    </Grid>
                    {list}
                </Grid>
            </Box>
        );



};

export default UserQuinielas;