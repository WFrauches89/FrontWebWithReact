import { Project } from '@/types';
import axios from 'axios';

export const axiosInstace = axios.create({
    baseURL: 'http://localhost:8080'
});

export class UsuarioService {
    getAll() {
        return axiosInstace.get('/usuarios');
    }

    getUserById(id: number) {
        return axiosInstace.get('/usuarios/' + id);
    }

    createUser(usuario: Project.Usuarios) {
        return axiosInstace.post('/usuarios', usuario);
    }

    updateUser(id: number, usuario: Project.Usuarios) {
        return axiosInstace.put('/usuarios/' + id, usuario);
    }

    deleteUser(id: number) {
        return axiosInstace.delete('/usuarios/' + id);
    }
}
