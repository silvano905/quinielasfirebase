import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import QuinielaComp from "../components/quinielas/QuinielaComp";
import {getMyQuinielas, selectMyQuinielas, selectQuinielas} from "../redux/quinielas/quinielasSlice";
import EditForm from "../components/account/EditForm";
import {selectJornada, selectJornadaId, selectNextJornada, selectNextJornadaId} from "../redux/jornadas/jornadasSlice";
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
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Paper from '@mui/material/Paper';
import PhoneIcon from '@mui/icons-material/Phone';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Link, useLocation} from "react-router-dom";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import Divider from "@mui/material/Divider";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SavingsIcon from '@mui/icons-material/Savings';
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import {selectUser, selectUserPhone} from "../redux/user/userSlice";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../config-firebase/firebase";
import ButtonGroup from "@mui/material/ButtonGroup";
import ReactGA from "react-ga4";

//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:'12px auto 2px auto'
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 22,
    textAlign: 'center',
    width: 200,
    margin: '8px auto 15px auto'
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background:"linear-gradient(45deg, #3d52d5 8%, #090c9b 80%)",
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    margin: '10px 10px 10px 10px'
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
    textAlign: 'center',
    width: 250,
    margin: '8px auto 15px auto'
}));

const Results = () => {
    const myQuinielas = useSelector(selectMyQuinielas)
    const allQuinielas = useSelector(selectQuinielas)
    const myPhoneNumber = useSelector(selectUserPhone)
    const currentJornada = useSelector(selectJornada)
    const nextJornada = useSelector(selectNextJornada)
    const currentJornadaId = useSelector(selectJornadaId)
    const nextJornadaId = useSelector(selectNextJornadaId)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const [showForm, setShowForm] = useState(false);
    const[jornadaFiveDigitId, setJornadaFiveDigitId] = useState(currentJornada.fiveDigitId)

    let location = useLocation()

    useEffect(() => {
        ReactGA.initialize('G-9ZG76GPGQF')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
        if(user.user){
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


    // let list
    // if(!loadingUserQuinielas&&userQuinielas){
    //
    //     list = userQuinielas.map(item =>{
    //         return(
    //             <>
    //                 <SingleQuiniela correct={item.correct} showScore='true' user={item.user} fiveDigitId={item.fiveDigitId} games={item.games}/>
    //             </>
    //         )
    //     })
    // }

    let list
    let playerWon = false
    let quantity = 0
    if(myQuinielas) {

        list = myQuinielas.map((item, i) =>{
            if(item.winner){
                quantity += currentJornada.prize
                playerWon = true
            }
            i+=1
            return(
                <>
                    <StyledTextTwo>
                        <Grid  container spacing={1} justifyContent="center">
                            <Grid item sm={4} lg={4} xs={4}>
                                Quiniela #{i}
                            </Grid>

                            <Grid item sm={4} lg={4} xs={4}>
                                Puntos: {item.correct}
                            </Grid>

                            <Grid item sm={4} lg={4} xs={4}>
                                {item.winner?
                                    <span style={{color: 'greenyellow'}}>Ganaste</span>
                                    :currentJornada.active?
                                        <span style={{color: 'coral'}}>Jornada sin terminar</span>
                                        :
                                        currentJornada.jornadaNumber!==item.jornadaNumber?
                                            <span style={{color: 'coral'}}>Jornada sin jugar</span>
                                            :
                                            <span style={{color: 'coral'}}>No ganaste</span>
                                }
                            </Grid>
                        </Grid>
                    </StyledTextTwo>

                </>
            )
        })
    }

    let topUsers
    if(allQuinielas){

        topUsers = allQuinielas.slice(0, 10).map((item, i) =>{
            i+=1
            return(
                <>
                    <StyledTextTwo>
                        <Grid container='row' spacing={1} justifyContent="space-between" alignItems="flex-start">
                            <Grid item>
                                {i}
                                <Link to={'/byId/'+ item.id} style={{textDecoration: 'none'}}>
                                    <Chip color="primary" icon={<FaceIcon />} label={item.data.username} style={{marginLeft: 8}}/>
                                </Link>
                            </Grid>
                            <Grid item>
                                Puntos: {item.data.correct}
                            </Grid>
                        </Grid>
                    </StyledTextTwo>

                </>
            )
        })
    }


    let winnersList
    let winnersCount = 0
    if(allQuinielas) {

        winnersList = allQuinielas.map((item, i) =>{
            if(item.data.winner){
                winnersCount += 1
            }
            return(
                <>
                    {item.data.winner?
                        <StyledTextTwo>
                            <Grid  container spacing={1} justifyContent="center">
                                <Grid item sm={4} lg={4} xs={4}>
                                    <Link to={'/get/'+ item.id} style={{textDecoration: 'none'}}>
                                        <Chip color="primary" icon={<FaceIcon />} label={item.data.username} style={{marginLeft: 2}}/>
                                    </Link>
                                </Grid>

                                <Grid item sm={4} lg={4} xs={4}>
                                    Puntos: {item.data.correct}
                                </Grid>

                                <Grid item sm={4} lg={4} xs={4}>
                                    <span style={{color: 'greenyellow'}}>Ganador</span>
                                </Grid>
                            </Grid>
                        </StyledTextTwo>
                        :
                        null
                    }
                </>
            )
        })
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid  container spacing={1} justifyContent="center">
                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Typography component="div" variant="h5" color="text.primary" style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                            Cantidad Ganada
                        </Typography>
                        <Divider>
                            <SavingsIcon style={{margin: 9}}/>
                        </Divider>
                        {playerWon?
                            <Typography component="div" variant="h5" color="text.primary">
                                ${quantity}
                            </Typography>
                            :
                            <Typography component="div" variant="h5" color="text.primary">
                                $0.00
                            </Typography>
                        }
                        <div style={{border: '2px blue solid', borderRadius: 5, marginTop: 10}}>
                            <Typography component="div" variant="h5" color="text.primary" style={{margin: 12, color: "red"}}>
                                Anuncio importante
                            </Typography>
                            <Typography component="div" variant="h5" color="text.primary" style={{textAlign: "start", margin: 12}}>
                                uno de nuestros representantes se comunicará con usted si gana por número de teléfono.
                            </Typography>
                            <Divider variant="middle" />
                            <Typography component="div" variant="h5" color="text.primary" style={{textAlign: "start", margin: 12}}>
                                si no podemos comunicarnos con usted por teléfono, le enviaremos un mensaje de
                                texto y un correo electrónico.
                            </Typography>
                        </div>

                        {user&&user.user?
                            <div style={{marginTop: 12}}>
                                <Typography component="div" variant="h5" color="text.primary" style={{color: "blue"}}>
                                    <PhoneIcon style={{margin:'0px 10px -4px auto'}}/>{myPhoneNumber}
                                </Typography>
                            </div>
                            :
                            null
                        }

                        {showForm && user?
                            <Grid item sm={12} lg={12} xs={12}>
                                <Button style={{margin: '10px auto 25px auto'}} variant="contained" color="warning" onClick={() => setShowForm(!showForm)}>Cancelar</Button>
                            </Grid>
                            :
                            user.user?
                                <Grid item sm={12} lg={12} xs={12}>
                                    <Button variant="contained" color="primary"
                                            onClick={() => setShowForm(!showForm)}
                                            style={{margin: 10}}
                                    >cambiar número de teléfono</Button>
                                </Grid>
                                :
                                null
                        }

                        {showForm&&user ?
                            <Grid item sm={12} lg={12} xs={12}>
                                <EditForm phone={myPhoneNumber} name={user.displayName} email={user.email} id={user.uid}/>
                            </Grid>
                            :
                            null
                        }

                        {/*{showForm&&user ?*/}
                        {/*    <Grid item sm={12} lg={12} xs={12}>*/}
                        {/*        <EditForm phone={user.phone} name={user.name} email={user.email} id={user._id}/>*/}
                        {/*    </Grid>*/}
                        {/*    :*/}
                        {/*    null*/}
                        {/*}*/}
                    </Item>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item sm={10} lg={10} xs={10}>
                                <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                    Mis Resultados
                                </Typography>
                                <Divider>
                                    <SportsSoccerIcon/>
                                </Divider>
                                {/*<Typography variant="h5" component="div" gutterBottom style={{color: 'blue'}}>*/}
                                {/*    Jornada {currentJornada.jornadaNumber}*/}
                                {/*</Typography>*/}
                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    <Button variant={jornadaFiveDigitId===currentJornada.id?'contained':'outlined'} onClick={()=>setJornadaFiveDigitId(currentJornada.id)}>Jornada {currentJornada.jornadaNumber}</Button>
                                    {nextJornada&&
                                        <Button variant={jornadaFiveDigitId===nextJornada.id?'contained':'outlined'} onClick={()=>setJornadaFiveDigitId(nextJornada.id)}>Jornada {nextJornada.jornadaNumber}</Button>
                                    }
                                </ButtonGroup>
                            </Grid>
                            <Grid item sm={10} lg={10} xs={10}>
                                {user?
                                    <>
                                        <Typography variant="h5" component="div" gutterBottom style={{color: '#004e98'}}>
                                            {user.displayName}
                                        </Typography>
                                    </>
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                        {myQuinielas&&myQuinielas.length>0?
                            <>
                                {list}
                            </>
                            :
                            <Typography variant="h5" component="div" gutterBottom style={{color: 'red'}}>
                                No tienes quinielas ganadoras de la jornada {currentJornada.jornadaNumber}
                            </Typography>

                        }
                    </Item>
                </Grid>

                <Grid item sm={9} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item sm={10} lg={10} xs={10}>
                                <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                    Mejores Quinielas
                                </Typography>
                                <Divider>
                                    <EmojiEventsIcon/>
                                </Divider>
                            </Grid>
                            <Grid item sm={10} lg={10} xs={10}>
                                {allQuinielas?
                                    <>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            Jornada {currentJornada.jornadaNumber}
                                        </Typography>
                                    </>
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                        {topUsers}
                    </Item>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Typography component="div" variant="h5" color="text.primary">
                            Quinielas ganadoras de otros jugadores
                        </Typography>
                        <Divider>
                            <MilitaryTechIcon/>
                        </Divider>
                        <Typography component="div" variant="h6" style={{color: "blue"}}>
                            Jornada {currentJornada.jornadaNumber}
                        </Typography>
                        {currentJornada.active?
                            <Typography component="div" variant="h6" style={{color: 'blue'}}>
                                Esperando resultados de la jornada {currentJornada.jornadaNumber}
                            </Typography>
                            :
                            winnersCount>0?
                                winnersList
                                :
                                <Typography component="div" variant="h6" style={{color: 'red'}}>
                                    No hubo ganadores de la jornada {currentJornada.jornadaNumber}
                                </Typography>
                        }
                    </Item>
                </Grid>


                {/*<Grid item sm={11} lg={10} xs={11}>*/}
                {/*    {list}*/}
                {/*</Grid>*/}
                {/*<Grid item sm={10} lg={10} xs={10}>*/}
                {/*    <Item elevation={6}>xs=8</Item>*/}
                {/*</Grid>*/}
            </Grid>
        </Box>
    );

};

export default Results;