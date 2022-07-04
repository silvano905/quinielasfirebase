import React, {Fragment, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom"
import {selectJornada, selectNextJornada} from "../../redux/jornadas/jornadasSlice";
import { db } from '../../config-firebase/firebase'
import {collection, addDoc, serverTimestamp, query, orderBy, where, getDocs} from 'firebase/firestore'
import {setAlert, removeAlert} from "../../redux/alerts/alertsSlice";
// material ui imports for styling
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
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
import {getCart} from "../../redux/cart/cartSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
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

const StyledTextExtra = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: '#007f5f',
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

const BuyQuinielaForm = ({user, game}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nextJornada = useSelector(selectNextJornada)
    useEffect(() => {
    }, []);

    let games
    if(game){
        games = {}
        for (let i = 0; i < game.games.length; i++) {
            let name = game.games[i].gameName
            games[name] = ''
        }
    }

    //for extra games
    let gamesExtra
    if(game){
        gamesExtra = {}
        for (let i = 0; i < game.gamesExtra.length; i++) {
            let name = game.gamesExtra[i].gameName
            gamesExtra[name] = ''
        }
    }

    const [formData, setFormData] = useState(games);
    //extra games
    const [formDataExtra, setFormDataExtra] = useState(gamesExtra);
    const onChangeExtra = e => setFormDataExtra({...formDataExtra, [e.target.name]: e.target.value})
    //end

    const [disableButton, setDisableButton] = useState(false)

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})


    const onSubmit = async (e) => {
        e.preventDefault();
        if(!user){
            navigate('register')
        }else {
            setDisableButton(true)
            let gamesToAdd = [];
            for (const [key, value] of Object.entries(formData)) {
                gamesToAdd.push(
                    {
                        gameName: key,
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        played: false,
                        correct: false,
                        guess: formData[key],
                        result: ''
                    })
            }

            let gamesToAddExtra = [];
            for (const [key, value] of Object.entries(formDataExtra)) {
                gamesToAddExtra.push(
                    {
                        gameName: key,
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        played: false,
                        correct: false,
                        guess: formDataExtra[key],
                        result: ''
                    })
            }

            let p = collection(db, 'quinielas')
            addDoc(p, {
                username: user.displayName,
                userId: user.uid,
                fiveDigitId: nextJornada.id,
                correct: 0,
                paid: false,
                winner: false,
                jornadaNumber: nextJornada.jornadaNumber,
                games: gamesToAdd,
                gamesExtra: gamesToAddExtra,
                timestamp: serverTimestamp()

            }).then(()=>{
                dispatch(setAlert('Quiniela agregada', 'success'))
                let p = collection(db, 'quinielas')
                let order = query(p, orderBy('timestamp', 'desc'),
                    where("userId", "==", user.uid),
                    where("fiveDigitId", "==", nextJornada.id),
                    where("paid", "==", false),)

                getDocs(order).then(x=>{
                    dispatch(getCart(
                        x.docs.map(doc => ({data: doc.data(), id: doc.id}))
                    ))
                })

                setDisableButton(false)

                for (let i = 0; i < nextJornada.games.length; i++) {
                    let name = nextJornada.games[i].gameName
                    games[name] = ''
                }
                setFormData(games)

                for (let i = 0; i < nextJornada.gamesExtra.length; i++) {
                    let name = nextJornada.gamesExtra[i].gameName
                    gamesExtra[name] = ''
                }
                setFormDataExtra(gamesExtra)
            })
            setTimeout(()=>{dispatch(removeAlert())}, 6000)
        }
    };


    //close and open cart list
    const [showQuinielas, setShowQuinielas] = useState({
        show: false,
    });
    const {show} = showQuinielas;
    //end

    let list
    if(game){

        list = game.games.map(item =>{
            return(
                <>
                    <Grid item sm={9} lg={10} xs={9}>
                        <StyledText>
                            {item.gameName}
                        </StyledText>
                    </Grid>
                    <Grid item sm={3} lg={10} xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">elije</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData[item.gameName]}
                                name={item.gameName}
                                label="Age"
                                onChange={onChange}
                                required
                            >
                                <MenuItem value='L'>L</MenuItem>
                                <MenuItem value='E'>E</MenuItem>
                                <MenuItem value='V'>V</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </>
            )
        })
    }

    //extra games
    let listExtra
    if(game){

        listExtra = game.gamesExtra.map(item =>{
            return(
                <>
                    <Grid item sm={9} lg={10} xs={9}>
                        <StyledTextExtra>
                            {item.gameName}
                        </StyledTextExtra>
                    </Grid>
                    <Grid item sm={3} lg={10} xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">elije</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formDataExtra[item.gameName]}
                                name={item.gameName}
                                label="Age"
                                onChange={onChangeExtra}
                                required
                            >
                                <MenuItem value='L'>L</MenuItem>
                                <MenuItem value='E'>E</MenuItem>
                                <MenuItem value='V'>V</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </>
            )
        })
    }
    //end

    if(game) {
        return (
            <Fragment>
                <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={11} lg={7} xs={11}>
                            <form onSubmit={e => onSubmit(e)} style={{marginTop: 14}}>
                                <Grid container spacing={0} justifyContent="center">

                                    <Card sx={{ minWidth: 280 }} style={{background: 'linear-gradient(45deg, #ffffff 30%, #EEEEEE 90%)'}}>
                                        <CardContent>
                                            <Grid  container spacing={1} justifyContent="center">
                                                {list}
                                                <Grid item sm={9} lg={10} xs={9}>
                                                    <Typography variant="h6" component="div" gutterBottom style={{margin: "10px auto 10px auto", textAlign: "center"}}>
                                                        Si un partido de los 9 se suspende entonce se usará el primer partido alternativo. Si dos
                                                        partidos de los 9 se suspende entonces se usaran los dos partidos alternativos.
                                                    </Typography>
                                                </Grid>
                                                {listExtra}
                                            </Grid>
                                        </CardContent>
                                        <CardActions>
                                            {disableButton?
                                                <Button style={{margin: '-15px auto 5px auto', background: "whitesmoke", color: "black"}} type="submit" variant="contained" disabled>agregar</Button>
                                                :
                                                <Button style={{margin: '-15px auto 5px auto', background: "whitesmoke", color: "black"}} type="submit" variant="contained">agregar</Button>
                                            }
                                        </CardActions>
                                    </Card>


                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Box>
            </Fragment>
        )

    }else {

        return (
            <Fragment>
                <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={11} lg={7} xs={11}>
                            <Item>

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
            </Fragment>
        )

    }

}

export default BuyQuinielaForm;