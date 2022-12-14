import {Routes, Route, Link, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import BuyQuinielaForm from "./components/quinielas/BuyQuinielaForm";
import BuyQuinielas from "./pages/quinielas/BuyQuinielas";
import Alerts from "./components/alerts/Alert";
import CreateJornada from "./pages/admin/CreateJornada";
import Results from "./pages/Results";
import UpdateGamesScore from "./pages/admin/UpdateGamesScore";
import BottomNavbar from "./navbar/BottomNavbar";
import HomeAdmin from "./pages/admin/Home";
import UserQuinielas from "./pages/quinielas/UsersQuinielas";
import QuinielasById from "./pages/quinielas/QuinielasById";
import {useSelector} from "react-redux";
import {selectUser} from "./redux/user/userSlice";
import Cart from "./pages/Cart";
function App() {
  const userAuth = useSelector(selectUser)

  const ProtectedRoute = ({
                            user,
                            redirectPath = '/login',
                            children,
                          }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };

  return (
      <div>
          <Navbar/>
          <Alerts/>
          <Routes>
            <Route element={<ProtectedRoute user={userAuth} />}>
                <Route path="account" element={<Account />} />
                {/*<Route path='/buy' element={<BuyQuinielas />} />*/}
                {/*<Route path='/myQuinielas' element={<UserQuinielas />} />*/}
                <Route path='/admin' element={<HomeAdmin />} />
                <Route path='/update' element={<UpdateGamesScore />} />
                <Route path='/create' element={<CreateJornada />} />
                <Route path='/cart' element={<Cart />} />
                {/*<Route path='/results' element={<Results />} />*/}

            </Route>
              <Route path='/myQuinielas' element={<UserQuinielas />} />
              <Route path='/buy' element={<BuyQuinielas />} />
              <Route path='/byId/:id' element={<QuinielasById />} />
              <Route path='/results' element={<Results />} />
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
          <BottomNavbar/>
      </div>
  );
}

export default App;
