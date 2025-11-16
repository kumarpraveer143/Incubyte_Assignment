import { Suspense } from "react"
import {Route,Routes} from "react-router-dom"

import LoadingAnimation from "../component/LoadingAnimation"
import Login from "../pages/Login"
import Register from "../pages/Register"
import UserDashboard from "../pages/UserDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import NotFound from "../pages/NotFound"
import HomeRedirect from "../pages/HomeRedirect"

export default function AppRoute(){
    return (
        <Routes>
            <Route  path="/login"  element={<Suspense fallback={<LoadingAnimation/>}> <Login/> </Suspense>}/>
            <Route  path="/register" element={<Suspense fallback={<LoadingAnimation/>}> <Register/> </Suspense>}/>
            <Route  path="/user-dashboard" element={<Suspense fallback={<LoadingAnimation/>}> <UserDashboard/> </Suspense>}/>
            <Route  path="/admin-dashboard" element={<Suspense fallback={<LoadingAnimation/>}> <AdminDashboard/> </Suspense>}/>
            {/* here inside / we need to move to other route(login,user-dashboard,admin-dashboard) based on user login or 
            not , his role admin or not (we put its logic in element={ }) */}
            <Route  path="/" element={<HomeRedirect/>}/>
            <Route  path="/*" element={<Suspense fallback={<LoadingAnimation/>}> <NotFound/> </Suspense>}/>
        </Routes>
    )
}