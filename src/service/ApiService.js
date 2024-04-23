import api from "./Interceptors";

export const signUp = (data) => {
    return api.post('/user/signup',data);
}

export const login = (data) => {
    return api.post('/user/login',data);
}

export const logout = (data) => {
    return api.post('user/logout',data);
}

export const uploadMedia = (data) => {
    console.log(data);
    return api.post('http://localhost/projects/react/upload-media-admin/Api/FileUploadController/uploadFile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':'Basic YXBwVXNlcjpBZG1pbkAyMDE4'
        }
    });
}

export const getAllData = (token) => {
    return api.post('http://localhost/projects/react/upload-media-admin/Api/FileUploadController/getAllData',{'token':token});
}