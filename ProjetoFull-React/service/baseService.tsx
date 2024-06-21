import axios from 'axios';

export const axiosInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
    //'http://localhost:8080'
});

export class BaseService {
    url: string;

    constructor(url: string) {
        this.url = url;
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
