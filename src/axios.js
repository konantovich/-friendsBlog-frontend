import axios from "axios";

import { mainUrl } from './mainUrl'

const instance = axios.create({
    baseURL: mainUrl
});

//middleware 
//add in ALL request authorization field (need for save auth token)
instance.interceptors.request.use(  (req) => {
        req.headers.authorization = window.localStorage.getItem('token')
       //backend response auth ok or not
   return req;
   
  });

export default instance;