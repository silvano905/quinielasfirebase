import React, {useState, Fragment, useEffect} from 'react';
import {db} from '../../config-firebase/firebase'
import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../redux/user/userSlice";
import {Navigate} from "react-router-dom";
// material ui
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {getPromotions, selectPromotions} from "../../redux/promotions/promotionsSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function PromotionComp() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const currentPromotion = useSelector(selectPromotions)
    useEffect(() => {
        //get promotion
        let promoRef = collection(db, 'promotions')
        let promoQuery = query(promoRef, orderBy('timestamp', 'desc'), limit(1), where("active", "==", true))
        const promoObj = getDocs(promoQuery).then(x=>{
            x.forEach((doc) => {
                dispatch(getPromotions({data: doc.data(), id: doc.id}))
            });
        })
    }, []);
    const [videoIds, setVideoIds] = useState([]);
    const [formData, setFormData] = useState({
        buy: currentPromotion?currentPromotion.data.buy:0,
        free: currentPromotion?currentPromotion.data.free:0,
        active: !!(currentPromotion && currentPromotion.data.active)
    });

    const [disableButton, setDisableButton] = useState(false)


    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { buy, free, active } = formData;

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        updateDoc(doc(db, "promotions", currentPromotion.id), {
            buy: parseInt(buy),
            free: parseInt(free),
            active: active,
        }).then(()=>{
            setDisableButton(false)
        })

    }

    if(!user.user||user.user.uid!=='RO8bagM0g0SSnoLcdKWfmB91aM52'){
        return <Navigate to='/'/>
    }
    return (
        <Fragment>
            <Item elevation={4}>
                <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                    Promotion Section
                </Typography>

                <form onSubmit={register} style={{marginTop: 10}}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="standard-basic"
                                    label="Buy"
                                    name="buy"
                                    type="number"
                                    inputProps={{ maxLength: 2 }}
                                    value={buy}
                                    onChange={onChange}
                                    required
                                    style={{marginTop: 10}}
                                    helperText="Minimum amount of paid quinielas to received the promotion?"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="standard-basic2"
                                    label="Free"
                                    name="free"
                                    type="number"
                                    inputProps={{ maxLength: 2 }}
                                    value={free}
                                    onChange={onChange}
                                    required
                                    style={{marginTop: 10}}
                                    helperText="How many quinielas will the users received for the promotion?"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item sm={7} lg={7} xs={9}>
                            <FormControlLabel
                                control={
                                    <Switch checked={active} onChange={()=>setFormData({ ...formData, active: !active })} name="active" />
                                }
                                label="active promotion?"
                            />
                        </Grid>


                        <Grid item sm={9} lg={8} xs={9}>
                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Update</Button>
                        </Grid>


                    </Grid>
                </form>
            </Item>
        </Fragment>
    );
}

export default PromotionComp;