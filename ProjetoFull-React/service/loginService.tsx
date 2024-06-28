import axios from 'axios';

export const axiosInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
    //'http://localhost:8080'
});

export class LoginService {
    create(usuario: Project.Usuario) {
        return axiosInstace.post('/auth/newUser', usuario);
    }

    logar(login: String, password: String) {
        return axiosInstace.post('/auth/login', {
            username: login,
            password: password
        });
    }
}
