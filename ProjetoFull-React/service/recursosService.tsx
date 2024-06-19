import { Project } from '@/types';
import axios from 'axios';
import { BaseService } from './baseService';

export class RecursosService extends BaseService {
    constructor() {
        super('/recursos');
    }
}
