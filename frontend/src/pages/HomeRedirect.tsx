import { useSelector } from "react-redux";
import type { ReduxStoreType } from "../redux/store";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../component/LoadingAnimation";
import { useEffect } from "react";

export default function HomeRedirect(){
    const navigate=useNavigate();
    const userInfo=useSelector((state:ReduxStoreType)=>state.userData.userInfo);
    useEffect(()=>{
        if(userInfo?.token && userInfo?.user?.role==="CUSTOMER")    navigate("/user-dashboard");
        else if(userInfo?.token && userInfo?.user?.role==="ADMIN")    navigate("/admin-dashboard");
        else navigate("/login");
    },[userInfo,navigate])
    return (
        <LoadingAnimation/>
    )
}