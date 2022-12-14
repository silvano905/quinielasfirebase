import React, {useState, Fragment, useEffect} from 'react';
import {db} from '../../config-firebase/firebase'
import {addDoc, collection, serverTimestamp, updateDoc, doc, query, orderBy, limit, getDocs} from "firebase/firestore";
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
import {getPrice, selectPrice} from "../../redux/price/priceSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function PriceComp() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const currentPrice = useSelector(selectPrice)

    useEffect(() => {
        //get price for quinielas
        let priceRef = collection(db, 'price')
        let priceQuery = query(priceRef, orderBy('timestamp', 'desc'), limit(1))
        const priceObj = getDocs(priceQuery).then(x=>{
            x.forEach((doc) => {
                dispatch(getPrice({data: doc.data(), id: doc.id}))
            });
        })
    }, []);
    const [videoIds, setVideoIds] = useState([]);
    const [formData, setFormData] = useState({
        priceMEX: currentPrice?currentPrice.data.priceMEX:0,
        priceUSD: currentPrice?currentPrice.data.priceUSD:0,
        prizeMEX: currentPrice?currentPrice.data.prizeMEX:'29,000',
        prizeUSD: currentPrice?currentPrice.data.prizeUSD:'1,500'
    });

    const [disableButton, setDisableButton] = useState(false)


    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { priceMEX, priceUSD, prizeMEX, prizeUSD } = formData;

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        updateDoc(doc(db, "price", currentPrice.id), {
            priceUSD: parseInt(priceUSD),
            priceMEX: parseInt(priceMEX),
            prizeUSD: prizeUSD,
            prizeMEX: prizeMEX,
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
                        Price & Pool Section
                    </Typography>

                    <form onSubmit={register} style={{marginTop: 10}}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item sm={11} lg={7} xs={11}>
                                <FormControl style={{width: 200}}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="standard-basic"
                                        label="priceUSD"
                                        name="priceUSD"
                                        type="number"
                                        inputProps={{ maxLength: 2 }}
                                        value={priceUSD}
                                        onChange={onChange}
                                        required
                                        style={{marginTop: 10}}
                                        helperText="Price per Quiniela for USA users"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item sm={11} lg={7} xs={11}>
                                <FormControl style={{width: 200}}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="standard-basic2"
                                        label="priceMEX"
                                        name="priceMEX"
                                        type="number"
                                        inputProps={{ maxLength: 2 }}
                                        value={priceMEX}
                                        onChange={onChange}
                                        required
                                        style={{marginTop: 10}}

                                    />
                                    <FormHelperText>Price per Quiniela for Mexico user <span style={{color: "red"}}>(in pesos)</span></FormHelperText>

                                </FormControl>
                            </Grid>


                            <Grid item sm={7} lg={7} xs={9}>
                                <FormControl style={{width: 200}}>
                                    <Select
                                        displayEmpty
                                        value={prizeUSD}
                                        name="prizeUSD"
                                        onChange={onChange}
                                        required
                                    >
                                        <MenuItem value="500">$500</MenuItem>
                                        <MenuItem value="1,000">$1,000</MenuItem>
                                        <MenuItem value="1,500">$1,500</MenuItem>
                                        <MenuItem value="2,000">$2,000</MenuItem>
                                        <MenuItem value="2,500">$2,500</MenuItem>
                                        <MenuItem value="3,000">$3,000</MenuItem>
                                        <MenuItem value="3,500">$3,500</MenuItem>
                                        <MenuItem value="4,000">$4,000</MenuItem>
                                        <MenuItem value="4,500">$4,500</MenuItem>
                                        <MenuItem value="5,000">$5,000</MenuItem>
                                    </Select>
                                    <FormHelperText>How much money will users from USA received if they win the quiniela?</FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid item sm={7} lg={7} xs={9}>
                                <FormControl style={{width: 200}}>
                                    <Select
                                        displayEmpty
                                        value={prizeMEX}
                                        name="prizeMEX"
                                        onChange={onChange}
                                        required
                                    >
                                        <MenuItem value="9,000">$9,000</MenuItem>
                                        <MenuItem value="19,000">$19,000</MenuItem>
                                        <MenuItem value="29,000">$29,000</MenuItem>
                                        <MenuItem value="39,000">$39,000</MenuItem>
                                        <MenuItem value="49,000">$49,000</MenuItem>
                                        <MenuItem value="59,000">$59,000</MenuItem>
                                        <MenuItem value="69,000">$69,000</MenuItem>
                                        <MenuItem value="79,000">$79,000</MenuItem>
                                        <MenuItem value="89,000">$89,000</MenuItem>
                                        <MenuItem value="99,000">$99,000</MenuItem>
                                    </Select>
                                    <FormHelperText>How much money <span style={{color: "red"}}>(in pesos)</span> will users from Mexico received if they win the quiniela?</FormHelperText>
                                </FormControl>
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

export default PriceComp;