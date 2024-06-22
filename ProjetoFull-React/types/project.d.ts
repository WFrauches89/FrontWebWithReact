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

    type Perfil = {
        id?: number;
        descricao: string;
    };

    type PerfilUsuario = {
        id?: number;
        perfilDTO: Perfil;
        usuarioDTO: Usuario;
    };

    type PermissaoPerfilRecurso = {
        id?: number;
        perfilDTO: Perfil;
        recursosDTO: Recurso;
    };
}
