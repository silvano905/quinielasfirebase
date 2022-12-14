import React, {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import PriceComp from "./CDU_Price";
import PromotionComp from "./CDU_Promotion";
import UpdateGamesScore from "./UpdateGamesScore";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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

function HomeAdmin() {
    const dispatch = useDispatch()

    let location = useLocation()

    useEffect(() => {

    }, []);


    let temp = true
    if(temp){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Grid item sm={11} lg={10} xs={11}>
                    <PriceComp/>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <PromotionComp/>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <UpdateGamesScore/>
                </Grid>

            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }


}

export default HomeAdmin;