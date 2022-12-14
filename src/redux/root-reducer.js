import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from '../redux/user/userSlice';
import jornadasReducer from '../redux/jornadas/jornadasSlice';
import quinielasReducer from '../redux/quinielas/quinielasSlice'
import cartReducer from '../redux/cart/cartSlice'
import priceReducer from '../redux/price/priceSlice'
import promotionReducer from '../redux/promotions/promotionsSlice'
import alertsReducer from '../redux/alerts/alertsSlice'
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'jornadas', 'quinielas', 'cart', 'alerts', 'price', 'promotions']
};

const rootReducer = combineReducers({
    user: userReducer,
    jornadas: jornadasReducer,
    quinielas: quinielasReducer,
    cart: cartReducer,
    alerts: alertsReducer,
    price: priceReducer,
    promotions: promotionReducer
});

export default persistReducer(persistConfig, rootReducer);