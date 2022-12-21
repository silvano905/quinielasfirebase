import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

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
import Paper from '@mui/material/Paper';
import PaidIcon from '@mui/icons-material/Paid';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {Link} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: ' 11px auto 2px auto',
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
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

const StyledTextThree = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'black',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextWrong = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background:"linear-gradient(45deg, #05668d 8%, #00a896 80%)",
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: '3px 3px 5px 8px',
    fontSize: 18,
}));

const StyledTextCorrect = styled(Typography)(({ theme }) => ({
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

const StyledCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background:"linear-gradient(45deg, #ffffff 8%, #fbfefb 80%)",
    margin: ' 11px auto 2px auto',
    width: 300
}));

const StyledTextFour = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)",
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: '5px 0 5px 0',
    marginBottom: 5
}));

const Winners = ({winners}) => {
    const [visible, setVisible] = useState(5)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 3)
    }

    let list = winners.slice(0, visible).map(item => {
        return(
            <Grid item sm={12} lg={10} xs={12}>
                <StyledTextWrong>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={4} lg={6} xs={4}>
                            <div style={{textAlign: "start"}}>
                                <Typography nowrap variant="h6" component="body1" gutterBottom style={{wordWrap: "break-word"}}>
                                    {item.user}
                                </Typography>
                            </div>

                        </Grid>
                        <Grid item sm={3} lg={6} xs={3}>
                            <Typography variant="h6" component="body1" gutterBottom>
                                {item.quantity}
                            </Typography>
                        </Grid>
                        <Grid item sm={3} lg={6} xs={3}>
                            <Typography variant="h6" component="body1" gutterBottom>
                                {item.jornada}
                            </Typography>
                        </Grid>
                        <Grid item sm={2} lg={6} xs={2}>
                            <Typography variant="h6" component="body1" gutterBottom>
                                {item.points}
                            </Typography>
                        </Grid>
                    </Grid>
                </StyledTextWrong>

            </Grid>
        )
    })

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Item elevation={6}>
                    <Typography variant="h4" component="div" gutterBottom style={{color: '#00367e', fontFamily: 'Cinzel, serif', marginTop: 10}}>
                        Historial de Ganadores
                    </Typography>
                    <div style={{margin: '5px auto 2px auto'}}>
                        <MilitaryTechIcon/>
                    </div>
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item sm={12} lg={10} xs={12}>
                            <StyledTextFour>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item sm={2} lg={6} xs={3}>
                                        <Typography variant="h6" component="body1" gutterBottom>
                                            Nombre
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={2} lg={6} xs={3}>
                                        <Typography variant="h6" component="body1" gutterBottom>
                                            Premio
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={2} lg={6} xs={3}>
                                        <Typography variant="h6" component="body1" gutterBottom>
                                            Jornada
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={2} lg={6} xs={3}>
                                        <Typography variant="h6" component="body1" gutterBottom>
                                            Puntos
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </StyledTextFour>
                        </Grid>
                        {list}
                    </Grid>
                    <Button onClick={showMoreItems} style={{margin: '15px auto 5px auto'}} variant="outlined">mostrar más ganadores</Button>

                    <StyledCard>
                        <Typography variant="h6" component="body1" gutterBottom>
                            Usuarios Registrados
                        </Typography>
                        <div>
                            <Typography variant="h6" component="body1" gutterBottom>
                                <AccountCircleIcon style={{marginBottom: -5, color: "blue"}}/> 81,032
                            </Typography>
                        </div>

                    </StyledCard>

                    <StyledCard>
                        <Typography variant="h6" component="body1" gutterBottom>
                            Dinero ganado por jugadores
                        </Typography>
                        <div>
                            <Typography variant="h6" component="body1" gutterBottom>
                                <PaidIcon style={{marginBottom: -5, color: "blue"}}/> +35,000 Dólares
                            </Typography>
                        </div>

                    </StyledCard>
                </Item>
            </Box>
        </>
    );

};

export default Winners;