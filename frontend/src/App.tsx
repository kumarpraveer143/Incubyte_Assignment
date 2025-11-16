import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoute";
import type { ReduxDispatchType, ReduxStoreType } from "./redux/store";
import { verifyUser } from "./redux/slice/userDataSlice";
import LoadingAnimation from "./component/LoadingAnimation";

function App() {
  const dispatch=useDispatch<ReduxDispatchType>();
  const token=useSelector((state:ReduxStoreType)=>state.userData.userInfo.token);
  const error=useSelector((state:ReduxStoreType)=>state.userData.error);
  const navigate=useNavigate();
  const location=useLocation();
  const [loading,setLoading]=useState(true);

  const initialVerify=useCallback(()=>{
    const authorization=localStorage.getItem('authorization') as string;
    if(!authorization){
       if(location.pathname==='/login' || location.pathname==='/register'){
        setLoading(false);
        return;
       }else{
        setLoading(false);
        navigate('/login');
        return;
       }
    }
    dispatch(verifyUser(authorization));
  },[localStorage,navigate,dispatch,verifyUser])

  useEffect(()=>{
    initialVerify();
  },[initialVerify])

  useEffect(()=>{
    if(token)
      setLoading(false);
  },[token])

  useEffect(()=>{
    if(error){
      localStorage.removeItem('authorization');
       if(location.pathname==='/login' || location.pathname==='/register'){
        setLoading(false);
        return;
       }else{
        setLoading(false);
        navigate('/login');
        return;
       }
    }
  },[error])

  if(loading)  <LoadingAnimation/>;
  return  <AppRoutes/>
}

export default App
