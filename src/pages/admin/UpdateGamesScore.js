import React, {Fragment, useState, useEffect} from "react";

import {useDispatch, useSelector} from "react-redux";
import { db } from '../../config-firebase/firebase'
import {collection, addDoc, serverTimestamp, updateDoc, doc,
    where, query, orderBy, limit, arrayUnion, getDocs
} from 'firebase/firestore'
// material ui imports for styling
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Switch from '@mui/material/Switch';
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
import {selectQuinielas} from "../../redux/quinielas/quinielasSlice";
import {getJornada, getNextJornada, selectJornada, selectJornadaId} from "../../redux/jornadas/jornadasSlice";
import {selectUser} from "../../redux/user/userSlice";
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
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
    textAlign: 'center',
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

const UpdateGamesScore = () => {
    // const allQuinielas = useSelector(selectQuinielas)
    const jornada = useSelector(selectJornada)
    const jornadaId = useSelector(selectJornadaId)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const [allQuinielas, setAllQuinielas] = useState();
    const [currentJornada, setCurrentJornada] = useState();
    useEffect(() => {

        //all paid quinielas
        let p = collection(db, 'quinielas')
        let order = query(p, orderBy('timestamp', 'desc'),
            where("paid", "==", true),
            where("fiveDigitId", "==", jornada.fiveDigitId) )
        const querySnapshot = getDocs(order).then(x=>{
            setAllQuinielas(x.docs.map(doc => ({
                data: doc.data(), id: doc.id
            })))
        })

        //get current jornada
        let nextJornadaRef = collection(db, 'jornadas')
        let nextJornadaOrder = query(nextJornadaRef, orderBy('timestamp', 'desc'), limit(1), where("activeJornada", "==", true))
        const querySnapshotNextJornada = getDocs(nextJornadaOrder).then(x=>{
            x.forEach((doc) => {
                setCurrentJornada(doc.data())
            });

        })


    }, []);


    let games
    if(jornada){
        games = {}
        for (let i = 0; i < jornada.games.length; i++) {
            let name = jornada.games[i].gameName
            games[name] = {
                home: jornada.games[i].gamePlayed ? jornada.games[i].homeResult: '',
                away: jornada.games[i].gamePlayed ? jornada.games[i].awayResult: '',
                canceled: !!jornada.games[i].canceled
            }
        }
    }

    //extra two games
    let gamesExtra
    if(jornada){
        gamesExtra = {}
        for (let i = 0; i < jornada.gamesExtra.length; i++) {
            let name = jornada.gamesExtra[i].gameName
            gamesExtra[name] = {
                home: jornada.gamesExtra[i].gamePlayed ? jornada.gamesExtra[i].homeResult: '',
                away: jornada.gamesExtra[i].gamePlayed ? jornada.gamesExtra[i].awayResult: '',
                canceled: !!jornada.gamesExtra[i].canceled
            }
        }
    }
    const [formDataExtra, setFormDataExtra] = useState(gamesExtra);
    const onChangeHomeExtra = e => setFormDataExtra({...formDataExtra, [e.target.name]: {...formDataExtra[e.target.name], home: e.target.value}})
    const onChangeAwayExtra = e => setFormDataExtra({...formDataExtra, [e.target.name]: {...formDataExtra[e.target.name], away: e.target.value}})
    const handleChangeCancelExtra = e => setFormDataExtra({...formDataExtra, [e.target.name]: {...formDataExtra[e.target.name], canceled: true}})
    //end

    const [formData, setFormData] = useState(games);
    const [open, setOpen] = useState(jornada.openToBuy);
    const [current, setCurrent] = useState(jornada.currentJornada);
    const [disableButton, setDisableButton] = useState(false)

    const onChangeHome = e => setFormData({...formData, [e.target.name]: {...formData[e.target.name], home: e.target.value}})
    const onChangeAway = e => setFormData({...formData, [e.target.name]: {...formData[e.target.name], away: e.target.value}})
    const handleChangeCancel = e => setFormData({...formData, [e.target.name]: {...formData[e.target.name], canceled: true}})

    async function updateQuiniela(listForm, gamesList) {
        let totalCorrect =  0
        let gamesPlayed = 0
        for (const [key, value] of Object.entries(gamesList)) {
            for (const [keyF, valueF] of Object.entries(listForm)) {
                if(gamesList[key].gameName===keyF){
                    if(!listForm[keyF].canceled) {
                        gamesPlayed += 1

                        let winner;
                        let homeS = parseInt(listForm[keyF].home)
                        let awayS = parseInt(listForm[keyF].away)

                        if(homeS>awayS){
                            winner = 'L'
                        }
                        if(homeS===awayS){
                            winner = 'E'
                        }
                        if(homeS<awayS){
                            winner = 'V'
                        }

                        if(gamesList[key].guess === winner){
                            totalCorrect += 1
                        }

                        gamesList[key].homeResult = listForm[keyF].home
                        gamesList[key].awayResult = listForm[keyF].away
                        gamesList[key].canceled = listForm[keyF].canceled
                        gamesList[key].gamePlayed = !!(homeS>=0 && awayS>=0)
                        gamesList[key].correct = gamesList[key].guess === winner;
                        gamesList[key].result = winner?winner:''
                    }else {
                        gamesList[key].homeResult = listForm[keyF].home
                        gamesList[key].awayResult = listForm[keyF].away
                        gamesList[key].canceled = listForm[keyF].canceled
                        gamesList[key].gamePlayed = false
                        gamesList[key].correct = false
                        gamesList[key].result = ''

                    }

                }
            }
        }

        return [gamesList, totalCorrect, gamesPlayed]
    }

    async function updateQuinielaExtra(listForm, gamesList) {
        let totalCorrect =  0
        let gamesPlayed = 0
        for (const [key, value] of Object.entries(gamesList)) {
            for (const [keyF, valueF] of Object.entries(listForm)) {
                if(gamesList[key].gameName===keyF){
                    if(!listForm[keyF].canceled){
                        gamesPlayed += 1
                    }
                    let winner;
                    let homeS = parseInt(listForm[keyF].home)
                    let awayS = parseInt(listForm[keyF].away)

                    if(homeS>awayS){
                        winner = 'L'
                    }
                    if(homeS===awayS){
                        winner = 'E'
                    }
                    if(homeS<awayS){
                        winner = 'V'
                    }

                    if(gamesList[key].guess === winner){
                        totalCorrect += 1
                    }

                    gamesList[key].homeResult = listForm[keyF].home
                    gamesList[key].canceled = listForm[keyF].canceled
                    gamesList[key].awayResult = listForm[keyF].away
                    gamesList[key].gamePlayed = !!(homeS>=0 && awayS>=0)
                    gamesList[key].correct = gamesList[key].guess === winner;
                    gamesList[key].result = winner?winner:''
                }
            }
        }

        return [gamesList, totalCorrect, gamesPlayed]
    }

    async function updateJornada(listForm, games) {
        let gamesPlayed = 0
        for (const [key, value] of Object.entries(games)) {
            for (const [keyF, valueF] of Object.entries(listForm)) {
                if(games[key].gameName===keyF){
                    if(listForm[keyF].home !== ''){
                        if(!listForm[keyF].canceled){
                            gamesPlayed += 1
                        }
                        games[key].homeResult = listForm[keyF].canceled?'':listForm[keyF].home
                        games[key].awayResult = listForm[keyF].canceled?'':listForm[keyF].away
                        games[key].gamePlayed = !listForm[keyF].canceled
                        games[key].canceled = listForm[keyF].canceled
                    }else {
                        games[key].homeResult = ''
                        games[key].awayResult = ''
                        games[key].gamePlayed = false
                        games[key].canceled = true
                    }

                }
            }
        }
        return [games, gamesPlayed]
    }

    const changeCurrentJornada = (e) => {
        e.preventDefault()
        //this jornada will no longer be available on the home page
        //make sure you make a new jornada
        if(user.user.uid==='RO8bagM0g0SSnoLcdKWfmB91aM52'){
            setCurrent(!current)
            setDisableButton(true)
            //players are no longer going to be able to buy from the current jornada/only from the next jornada
            let jornadaRef = doc(db, 'jornadas', jornadaId);
            updateDoc(jornadaRef,{
                activeJornada: !current
            }).then().catch(e=>console.log(e))
            setDisableButton(false)
        }
    }

    const closeJornadaToBuy = (e) => {
        e.preventDefault()
        if(user.user.uid==='RO8bagM0g0SSnoLcdKWfmB91aM52'){
            setDisableButton(true)
            setOpen(!open)
            //players are no longer going to be able to buy from the current jornada/only from the next jornada
            let jornadaRef = doc(db, 'jornadas', jornadaId);
            updateDoc(jornadaRef,{
                openToBuy: !open
            }).then().catch(e=>console.log(e))
            setDisableButton(false)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(user.user.uid==='RO8bagM0g0SSnoLcdKWfmB91aM52'){
            dispatch(setAlert('Quinielas updated', 'success'))
            setDisableButton(true)
            for (let i = 0; i < allQuinielas.length; i++) {
                let listQuiniela = await updateQuiniela(formData, allQuinielas[i].data.games)
                let listQuinielaExtra = await updateQuinielaExtra(formDataExtra, allQuinielas[i].data.gamesExtra)
                let docRef = doc(db, 'quinielas', allQuinielas[i].id)

                //check if games canceled
                let totalCorrect = 0
                if(listQuiniela[2]===9){
                    totalCorrect = listQuiniela[1]
                }
                if(listQuiniela[2]===8){
                    if(listQuinielaExtra[0][0].correct){
                        totalCorrect = listQuiniela[1] + 1
                    }else {
                        totalCorrect = listQuiniela[1]
                    }
                }
                if(listQuiniela[2]===7){
                    if(listQuinielaExtra[0][0].correct&&listQuinielaExtra[0][1].correct){
                        totalCorrect = listQuiniela[1] + 2
                    }
                    if(listQuinielaExtra[0][0].correct&&!listQuinielaExtra[0][1].correct){
                        totalCorrect = listQuiniela[1] + 1
                    }
                    if(!listQuinielaExtra[0][0].correct&&listQuinielaExtra[0][1].correct){
                        totalCorrect = listQuiniela[1] + 1
                    }
                    if(!listQuinielaExtra[0][0].correct&&!listQuinielaExtra[0][1].correct){
                        totalCorrect = listQuiniela[1]
                    }
                }

                updateDoc(docRef,{
                    games: listQuiniela[0],
                    gamesExtra: listQuinielaExtra[0],
                    correct: totalCorrect,
                    winner: totalCorrect === 9
                }).then().catch(e=>console.log(e))
                if(allQuinielas[i].correct===9){
                    addDoc(collection(db, 'winners'),{
                        date: serverTimestamp(),
                        jornada: jornada.jornadaNumber,
                        points: allQuinielas[i].correct,
                        quantity: `$${jornada.prize} USD`,
                        user: allQuinielas[i].username
                    }).then().catch(e=>console.log(e))
                }
            }

            //players are no longer going to be able to buy from the current jornada/only from the next jornada
            let jornadaRef = doc(db, 'jornadas', jornadaId);
            let listFormData = await updateJornada(formData, currentJornada.games)
            let listFormDataExtra = await updateJornada(formDataExtra, currentJornada.gamesExtra)
            updateDoc(jornadaRef,{
                openToBuy: false,
                games: listFormData[0],
                gamesExtra: listFormDataExtra[0]
            }).then().catch(e=>console.log(e))

            //we are checking for winners
            //all paid quinielas
            //we have to get all the paid quinielas again because we need the updated quinielas
            let p = collection(db, 'quinielas')
            let order = query(p, orderBy('timestamp', 'desc'),
                where("paid", "==", true),
                where("fiveDigitId", "==", jornada.fiveDigitId) )
            const querySnapshot = await getDocs(order)

            querySnapshot.forEach((doc)=> {
                if(doc.data().correct===9){
                    addDoc(collection(db, 'winners'),{
                        date: serverTimestamp(),
                        jornada: jornada.jornadaNumber,
                        points: doc.data().correct,
                        quantity: `$${jornada.prize} USD`,
                        user: doc.data().username
                    }).then().catch(e=>console.log(e))
                }
            })
            setDisableButton(false)
            setTimeout(()=>{dispatch(removeAlert())}, 3000)
        }
    };


    let list
    if(jornada){


        list = jornada.games.map(item =>{
            return(
                <>
                    <Grid item sm={2} lg={10} xs={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData[item.gameName].home}
                                name={item.gameName}
                                onChange={onChangeHome}
                            >
                                <MenuItem value='0'>0</MenuItem>
                                <MenuItem value='1'>1</MenuItem>
                                <MenuItem value='2'>2</MenuItem>
                                <MenuItem value='3'>3</MenuItem>
                                <MenuItem value='4'>4</MenuItem>
                                <MenuItem value='5'>5</MenuItem>
                                <MenuItem value='6'>6</MenuItem>
                                <MenuItem value='7'>7</MenuItem>
                                <MenuItem value='8'>8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={8} lg={10} xs={8}>
                        <StyledText>
                            {item.gameName}
                        </StyledText>
                    </Grid>
                    <Grid item sm={2} lg={10} xs={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData[item.gameName].away}
                                name={item.gameName}
                                onChange={onChangeAway}
                            >
                                <MenuItem value='0'>0</MenuItem>
                                <MenuItem value='1'>1</MenuItem>
                                <MenuItem value='2'>2</MenuItem>
                                <MenuItem value='3'>3</MenuItem>
                                <MenuItem value='4'>4</MenuItem>
                                <MenuItem value='5'>5</MenuItem>
                                <MenuItem value='6'>6</MenuItem>
                                <MenuItem value='7'>7</MenuItem>
                                <MenuItem value='8'>8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={11} lg={10} xs={11}>
                        <div style={{margin: '-18px 0px 15px 0px',display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center"}}>
                            <Typography variant="h6" component="div" gutterBottom>
                                game canceled?
                            </Typography>
                            <Switch
                                name={item.gameName}
                                checked={formData[item.gameName].canceled}
                                onChange={handleChangeCancel}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                    </Grid>
                </>
            )
        })
    }

    //extra two games
    let listExtra
    if(jornada){


        listExtra = jornada.gamesExtra.map(item =>{
            return(
                <>
                    <Grid item sm={2} lg={10} xs={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formDataExtra[item.gameName].home}
                                name={item.gameName}
                                onChange={onChangeHomeExtra}
                            >
                                <MenuItem value='0'>0</MenuItem>
                                <MenuItem value='1'>1</MenuItem>
                                <MenuItem value='2'>2</MenuItem>
                                <MenuItem value='3'>3</MenuItem>
                                <MenuItem value='4'>4</MenuItem>
                                <MenuItem value='5'>5</MenuItem>
                                <MenuItem value='6'>6</MenuItem>
                                <MenuItem value='7'>7</MenuItem>
                                <MenuItem value='8'>8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={8} lg={10} xs={8}>
                        <StyledText>
                            {item.gameName}
                        </StyledText>
                    </Grid>
                    <Grid item sm={2} lg={10} xs={2}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formDataExtra[item.gameName].away}
                                name={item.gameName}
                                onChange={onChangeAwayExtra}
                            >
                                <MenuItem value='0'>0</MenuItem>
                                <MenuItem value='1'>1</MenuItem>
                                <MenuItem value='2'>2</MenuItem>
                                <MenuItem value='3'>3</MenuItem>
                                <MenuItem value='4'>4</MenuItem>
                                <MenuItem value='5'>5</MenuItem>
                                <MenuItem value='6'>6</MenuItem>
                                <MenuItem value='7'>7</MenuItem>
                                <MenuItem value='8'>8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={11} lg={10} xs={11}>
                        <div style={{margin: '-18px 0px 15px 0px',display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center"}}>
                            <Typography variant="h6" component="div" gutterBottom>
                                game canceled?
                            </Typography>
                            <Switch
                                name={item.gameName}
                                checked={formDataExtra[item.gameName].canceled}
                                onChange={handleChangeCancelExtra}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                    </Grid>
                </>
            )
        })
    }



    return (
        <Fragment>
            <Item elevation={4}>
                <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                    Update Game Score
                </Typography>
                <form onSubmit={e => onSubmit(e)} style={{marginTop: 10}}>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={10} lg={11} xs={11}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Users will no longer be able to buy quinielas if you close it
                            </Typography>
                            <Button style={{margin: '5px auto 5px auto', color: "black"}} onClick={closeJornadaToBuy}
                                    variant="outlined">
                                {open?<span>Close Jornada</span>:<span>Open Jornada</span>}
                            </Button>
                        </Grid>

                        <Grid item sm={10} lg={11} xs={11}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Click to make the next quiniela as the main to display. This quiniela will no longer be display on the home page.
                            </Typography>
                            <Button style={{margin: '5px auto 20px auto', color: "black", textAlign: "center"}} onClick={changeCurrentJornada}
                                    variant="outlined">
                                {current?<span>make inactive</span>:<span>activate</span>}
                            </Button>
                        </Grid>

                    </Grid>

                    <Grid  container spacing={1} justifyContent="center">
                        {list}
                    </Grid>
                    <Grid  container spacing={1} justifyContent="center">
                        {listExtra}
                    </Grid>
                    <Button style={{margin: 15}} type="submit" variant="contained" color="primary">submit</Button>

                </form>
            </Item>
        </Fragment>
    )
}

export default UpdateGamesScore;