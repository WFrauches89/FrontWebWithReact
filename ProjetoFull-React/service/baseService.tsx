import axios from 'axios';
import { error } from 'console';

export const axiosInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
    //'http://localhost:8080'
});

export class BaseService {
    url: string;

    constructor(url: string) {
        this.url = url;

        axiosInstace.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('TOKEN_APLICACAO_FRONTEND');
                const authRequest = token ? `Bearer ${token}` : '';
                config.headers['Authorization'] = authRequest;
                return config;
            },
            (error) => Promise.reject(error)
        );

        axiosInstace.interceptors.response.use(
            (response) => {
                return response;
            },
            async (erro) => {
                const oCongif = erro.config;
                if (erro.response.status == 401) {
                    localStorage.removeItem('TOKEN_APLICACAO_FRONTEND');
                    window.location.reload();
                }
                return Promise.reject(erro);
            }
        );
    }

    getAll() {
        return axiosInstace.get(this.url);
    }

    getById(id: number) {
        return axiosInstace.get(this.url + '/' + id);
    }

    create(object: any) {
        return axiosInstace.post(this.url, object);
    }

    update(id: number, object: any) {
        return axiosInstace.put(this.url + '/' + id, object);
    }

    delete(id: number) {
        return axiosInstace.delete(this.url + '/' + id);
    }
}
