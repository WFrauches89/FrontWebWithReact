declare namespace Project {
    type Usuario = {
        id?: number;
        nome: string;
        login: string;
        email: string;
        senha: string;
    };

    type Recurso = {
        id?: number;
        nome: string;
        chave: string;
    };
}
