import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from '../redux/user/userSlice';
import jornadasReducer from '../redux/jornadas/jornadasSlice';
import quinielasReducer from '../redux/quinielas/quinielasSlice'
import cartReducer from '../redux/cart/cartSlice'
import alertsReducer from '../redux/alerts/alertsSlice'
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'jornadas', 'quinielas', 'cart', 'alerts']
};

const rootReducer = combineReducers({
    user: userReducer,
    jornadas: jornadasReducer,
    quinielas: quinielasReducer,
    cart: cartReducer,
    alerts: alertsReducer
});

export default persistReducer(persistConfig, rootReducer);