import axios from "axios";

const api = axios.create({
    
    baseURL:'http://localhost/projects/react/upload-media-admin/Api',
    // headers:{Authorization:'Basic YXBwVXNlcjpBZG1pbkAyMDE4'}

});

api.interceptors.request.use(
    (config) => {
        const token = 'Basic YXBwVXNlcjpBZG1pbkAyMDE4';
        if(token){
            config.headers.Authorization = token;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

export default api;