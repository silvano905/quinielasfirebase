import {collection, doc, getDocs, orderBy, query, updateDoc, where} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import {getMyQuinielas, selectMyQuinielas} from "../../redux/quinielas/quinielasSlice";
import {selectUser, updateFreeQuantity} from "../../redux/user/userSlice";
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectJornada, selectNextJornada} from "../../redux/jornadas/jornadasSlice";
import {selectCart} from "../../redux/cart/cartSlice";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import React from 'react'


const GetFreeQuinielasComponent = () => {


    const nextJornada = useSelector(selectNextJornada)
    const myQuinielas = useSelector(selectMyQuinielas)
    const user = useSelector(selectUser)
    const myCart = useSelector(selectCart)
    let userCountryPrice = 0
    const currentJornada = useSelector(selectJornada)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const x = (e) => {
        e.preventDefault()
        let updateFreeQuantityTotal = myCart.length>=user.userData.freeQuantity?0:user.userData.freeQuantity-myCart.length
        for (let i = 0; i < myCart.length; i++) {
            let docRef = doc(db, 'quinielas', myCart[i].id)
            updateDoc(docRef,{
                paid: true
            }).then(()=>{
            })
        }
        let p = collection(db, 'quinielas')
        let order = query(p, orderBy('timestamp', 'desc'),
            where("userId", "==", user.user.uid),
            where("paid", "==", true),
            where("fiveDigitId", "==", currentJornada.fiveDigitId))
        const querySnapshot = getDocs(order).then(x=>{
            dispatch(getMyQuinielas(
                x.docs.map(doc => (doc.data()))
            ))
        })
        updateDoc(doc(db, 'usersData', user.user.uid),{
            freeQuantity: updateFreeQuantityTotal,
            referredFriendPromoUsed: true
        }).then(()=>{
            dispatch(updateFreeQuantity({freeQuantity: updateFreeQuantityTotal}))
            let p = collection(db, 'quinielas')
            let order = query(p, orderBy('timestamp', 'desc'),
                where("userId", "==", user.user.uid),
                where("paid", "==", true),
                where("fiveDigitId", "==", currentJornada.fiveDigitId))
            const querySnapshot = getDocs(order).then(x=>{
                dispatch(getMyQuinielas(
                    x.docs.map(doc => (doc.data()))
                ))
            })
        })

        //TODO
        //add alerts and redirects
        dispatch(setAlert('Recibiste quinielas gratis', 'success'))
        navigate('/myQuinielas')
        setTimeout(()=>{dispatch(removeAlert())}, 6000)
    }
    return(
        <Button style={{margin: '5px auto 15px auto'}} onClick={x}
                variant="contained">
            recibir quinielas gratis
        </Button>
    )


}

export default GetFreeQuinielasComponent