import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, updateFreeQuantity, updatePhoneNumber} from "../../redux/user/userSlice";
import {selectCart} from "../../redux/cart/cartSlice";
import {collection, doc, getDocs, limit, orderBy, query, updateDoc, where} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";
import {useNavigate} from "react-router-dom";
import {getMyQuinielas} from "../../redux/quinielas/quinielasSlice";
import {selectJornada} from "../../redux/jornadas/jornadasSlice";
import {selectPromotions} from "../../redux/promotions/promotionsSlice";
import {selectPrice} from "../../redux/price/priceSlice";

export default function PaypalButton({code}) {
    const quinielaPrice = useSelector(selectPrice)
    const user = useSelector(selectUser)
    const promo = useSelector(selectPromotions)
    const myCart = useSelector(selectCart)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const currentJornada = useSelector(selectJornada)

    return (
        <PayPalScriptProvider options={{ "client-id": "ARKvpROKj_9XXz1CvqDvDZZQ2kAKZNaY1IuJFTG0IDRfb53ymTBM55MxL8VT-37zbKdO6cespANkccG8" }}>
            <PayPalButtons
                createOrder= {(data, actions) => {
                    let countryPrice = user.userData.country==='México'?quinielaPrice.data.priceMEX:quinielaPrice.data.priceUSD
                    let total = myCart.length*countryPrice-user.userData.freeQuantity*countryPrice
                    let currency = user.userData.country==="México"?'MXN':'USD'
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: 'quinielas liga mx',
                                amount: {
                                    currency_code: currency,
                                    value: total,
                                },
                            },
                        ],
                        application_context: { shipping_preference: 'NO_SHIPPING'}
                    });
                }}
                onError={function () {
                    dispatch(setAlert('Tu pago no fue aceptado', 'warning'))
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        let updateFreeQuantityTotal = myCart.length>=user.userData.freeQuantity?0:user.userData.freeQuantity-myCart.length
                        for (let i = 0; i < myCart.length; i++) {
                            let docRef = doc(db, 'quinielas', myCart[i].id)
                            updateDoc(docRef,{
                                paid: true
                            }).then(()=>{
                            })
                        }

                        updateDoc(doc(db, 'usersData', user.user.uid),{
                            freeQuantity: myCart.length>=promo&&promo.data.buy?updateFreeQuantityTotal+promo.data.free:updateFreeQuantityTotal,
                            referredFriendPromoUsed: true
                        }).then(()=>{
                            dispatch(updateFreeQuantity({freeQuantity: myCart.length>=promo&&promo.data.buy?updateFreeQuantityTotal+promo.data.free:updateFreeQuantityTotal}))
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

                        //section for adding 5 free quinielas to the friends coupon
                        //we only do this if this is the first time the user is using the prom
                        if(myCart.length>=1&&!user.userData.referredFriendPromoUsed) {
                            let friend = collection(db, 'usersData')
                            let findFriend = query(friend, orderBy('timestamp', 'desc'),
                                limit(1),
                                where("userCouponCode", "==", user.friendCouponCode))

                            if(findFriend){
                                const querySnapshot = getDocs(findFriend).then(x=>{
                                    x.forEach(document=>{
                                        updateDoc(doc(db, 'usersData', document.id),{
                                            freeQuantity: document.data().freeQuantity += 5,
                                            totalReferredFriends: document.data().totalReferredFriends += 1
                                        }).then()
                                    })
                                })
                            }
                            }

                        //TODO
                        //add alerts and redirects
                        dispatch(setAlert('Tu pago fue aceptado', 'success'))
                        if(myCart.length>=4&&promo){
                            dispatch(setAlert(`Recibiste ${promo.data.free} quinielas gratis`, 'success'))
                        }
                        navigate('/myQuinielas')
                        setTimeout(()=>{dispatch(removeAlert())}, 6000)
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}