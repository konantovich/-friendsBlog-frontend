import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Header } from "./components/Header/Header";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth); 
  React.useEffect(() => {
    dispatch(fetchAuthMe())
  }, []);
  

  return (
    <>
      <Header />
      <Container maxWidth="lg">
      <GoogleOAuthProvider clientId="178072032538-qdvpbg1mp8p2fc86tmmeuar6n9usci0u.apps.googleusercontent.com">...
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/posts/:id" element={<FullPost/>}/>
          <Route path="/posts/:id/edit" element={<AddPost/>}/>
          <Route path="/add-post" element={<AddPost/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Registration/>}/>
        </Routes>
        </GoogleOAuthProvider>;
      </Container>
    </>
  );
}

export default App;
