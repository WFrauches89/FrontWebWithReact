import { BaseService } from './baseService';

export class UsuarioService extends BaseService {
    constructor() {
        super('/usuarios');
    }
}
