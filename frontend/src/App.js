import AppRouter from "./AppRoutes";
import Header from "./components/Header/Header";
import Loading from "./components/Loading/Loading";
import { useLoading } from "./hooks/useLoading";
import setLoadingInterceptor from "./interceptors/loadingInterception";
import { useEffect } from "react";


function App() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [] );

  return(
    <>
  <Loading/>
  <Header/>
  <AppRouter/>
   </>
  );

}

export default App;
