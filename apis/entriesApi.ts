import axios from 'axios';


const entriesApi = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://todo-app-advance.vercel.app/api' : '/api' 
})


export default entriesApi;



