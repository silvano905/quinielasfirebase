import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where
} from "firebase/firestore";
import {getJornada, selectJornada, getNextJornada, selectNextJornada} from "../redux/jornadas/jornadasSlice";
import { Waypoint } from 'react-waypoint';
import {db} from '../config-firebase/firebase'
import {getQuinielas, selectQuinielas, getWinners, selectWinners} from "../redux/quinielas/quinielasSlice";
import QuinielaComp from "../components/quinielas/QuinielaComp";
import Winners from "../components/quinielas/Winners";
import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
import {styled} from "@mui/material/styles";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReactGA from "react-ga4";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

function Home() {
    const dispatch = useDispatch()
    const allQuinielas = useSelector(selectQuinielas)
    const [filterQuinielas, setFilterQuinielas] = useState('correct');
    const currentJornada = useSelector(selectJornada)
    const winners = useSelector(selectWinners)
    const [visible, setVisible] = useState(1)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 1)
    }

    useEffect(() => {
        //get current jornada
        let p = collection(db, 'jornadas')
        let order = query(p, orderBy('timestamp', 'desc'), limit(1), where("currentJornada", "==", true))
        const querySnapshot = getDocs(order).then(x=>{
            let fiveDigitIDJornada
            x.forEach((doc) => {
                fiveDigitIDJornada=doc.data().id
                dispatch(getJornada({data: doc.data(), id: doc.id}))
            });

            //get all paid quinielas
            let quinielasRef = collection(db, 'quinielas')
            let quinielasQuery = query(quinielasRef, orderBy(filterQuinielas, 'desc'),
                where("paid", "==", true), where("fiveDigitId", "==", fiveDigitIDJornada))
            onSnapshot(quinielasQuery, (snapshot) => {
                dispatch(
                    getQuinielas(
                        snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))
                    )
                )
            })
        })

        //get next jornada if their is one
        let nextJornadaRef = collection(db, 'jornadas')
        let nextJornadaOrder = query(nextJornadaRef, orderBy('timestamp', 'desc'), limit(1), where("nextJornada", "==", true))
        const querySnapshotNextJornada = getDocs(nextJornadaOrder).then(x=>{
            x.forEach((doc) => {
                dispatch(getNextJornada({data: doc.data(), id: doc.id}))
            });
        })


        //get winners list
        let winnersRef = collection(db, 'winners')
        let winnersQuery = query(winnersRef, orderBy('date', 'desc'))
        let winnersSnap = getDocs(winnersQuery).then(x=>{
            dispatch(
                getWinners(
                    x.docs.map(doc => (doc.data()))
                )
            )
        })

    }, [filterQuinielas,]);

    let quinielasList;
    if(allQuinielas){
        quinielasList = allQuinielas.slice(0, visible).map(item => {
            return (
                <>
                    <QuinielaComp game={item.data} showScore='true'/>
                    <Waypoint onEnter={showMoreItems}/>
                </>
            )
        })
    }

    if(currentJornada&&allQuinielas){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item sm={10} lg={10} xs={10}>
                                <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                    Liga Mx Quiniela 2022
                                </Typography>
                                <Divider>
                                    <SportsSoccerIcon/>
                                </Divider>
                            </Grid>
                            <Grid item sm={10} lg={10} xs={10}>
                                {currentJornada?
                                    <>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            Jornada {currentJornada.jornadaNumber}
                                        </Typography>
                                        <Typography variant="h6" component="div" gutterBottom style={{color: '#004e98'}}>
                                            Termina el {currentJornada.endDate}
                                        </Typography>
                                    </>
                                    :
                                    null
                                }
                            </Grid>
                            <Grid item sm={11} lg={10} xs={11}>
                                {/*<StyledText>*/}
                                {/*    Premio: {!loadingJornada&&jornada?<span style={{color: '#02CC92'}}>${jornada.prize}</span>:null} dolares*/}
                                {/*</StyledText>*/}
                                <Accordion style={{background:"linear-gradient(45deg, #3d52d5 8%, #090c9b 80%)", color: 'whitesmoke'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6" gutterBottom>Con 9 Puntos Ganas ${currentJornada.prize} Dolares</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                            Necesitas hacer 9 puntos en una quiniela para ganar los ${currentJornada.prize} dolares automaticamente.
                                        </Typography>
                                        <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                            Cada persona con 9 puntos gana ${currentJornada.prize} dolares sin importar la cantidad de ganadores.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion style={{background:"linear-gradient(45deg, #3d52d5 8%, #090c9b 80%)", color: 'whitesmoke', marginTop: 8}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon  style={{color: "white"}}/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6" gutterBottom>$2.00 Dolares por Quiniela</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                            Cada quiniela cuesta $2.00 Dolares
                                        </Typography>
                                        <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                            Puedes pagar con tarjeta de credito o Paypal.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item sm={10} lg={10} xs={10}>
                                {/*<StyledTextTwo>*/}
                                {/*    A los ganadores se les contactara por numero de telefono.*/}
                                {/*    Pueden recojer el dineron en un Wester Union o a su cuenta de banco.*/}
                                {/*</StyledTextTwo>*/}

                            </Grid>
                        </Grid>
                    </Item>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Typography variant="h5" component="div" gutterBottom style={{fontFamily: 'Secular One, sans-serif', marginTop: 10}}>
                            Formas de recibir ganacias:
                        </Typography>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item sm={11} lg={6} xs={11}>
                                <Accordion style={{background:"linear-gradient(45deg, #3d52d5 8%, #090c9b 80%)", color: 'whitesmoke'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon  style={{color: "white"}}/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6" gutterBottom>Western Union</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="h6" gutterBottom style={{textAlign: "start"}}>
                                            la forma m??s f??cil y rapida de recibir su dinero.
                                        </Typography>
                                        <Divider variant="middle" style={{margin: '10px 0 10px 0'}}/>
                                        <Typography variant="h6" gutterBottom style={{textAlign: "start"}}>
                                            uno de nuestros representantes lo llamar?? cuando gane por tel??fono para pedir tu informaci??n.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item sm={11} lg={6} xs={11}>
                                <Accordion style={{background:"linear-gradient(45deg, #3d52d5 8%, #090c9b 80%)", color: 'whitesmoke'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon  style={{color: "white"}}/>}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography variant="h6" gutterBottom style={{textAlign: "start"}}>Cuenta de Banco <span style={{color: '#ffc300', fontSize: 15}}>recomendado</span></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="h6" gutterBottom style={{textAlign: "start"}}>
                                            la forma m??s segura de recibir tu dinero
                                        </Typography>
                                        <Divider variant="middle" style={{margin: '10px 0 10px 0'}}/>
                                        <Typography variant="h6" gutterBottom style={{textAlign: "start"}}>
                                            uno de nuestros representantes lo llamar?? cuando gane por tel??fono para pedir tu informaci??n.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item sm={11} lg={6} xs={11}>
                                <MoreHorizIcon/>
                            </Grid>
                        </Grid>

                    </Item>
                </Grid>

                {winners&&
                    <Grid item sm={11} lg={10} xs={11}>
                        <Winners winners={winners}/>
                    </Grid>
                }


                <Grid item xs={12} sm={12} lg={7}>
                    <Typography variant="h5" component="div" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif', textAlign: "center", marginTop: 20}}>
                        Quinielas Activas
                    </Typography>
                    <div style={{textAlign: "center", margin: '5px 0 0 0'}}>
                        <ButtonGroup size='medium'>
                            <Button variant={filterQuinielas==='timestamp'?'contained':'outlined'} onClick={()=>setFilterQuinielas('timestamp')}>Recientes</Button>
                            <Button variant={filterQuinielas==='correct'?'contained':'outlined'} onClick={()=>setFilterQuinielas('correct')}>+ puntos</Button>
                        </ButtonGroup>
                    </div>
                </Grid>

                <Grid item xs={11} sm={11} lg={7}>
                    {quinielasList}
                </Grid>

            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }


}

export default Home;