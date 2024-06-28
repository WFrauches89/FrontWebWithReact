/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LoginService } from '@/service/loginService';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    let usuarioVazio: Project.Usuario = {
        nome: '',
        login: '',
        email: '',
        senha: ''
    };

    const [usuario, setUsuario] = useState<Project.Usuario>(usuarioVazio);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);
    const loginService = useMemo(() => new LoginService(), []);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: val
        }));
    };

    const newUser = () => {
        loginService
            .create(usuario)
            .then(() => {
                setUsuario(usuarioVazio);

                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Usuário cadastrado com sucesso!',
                    sticky: true
                });

                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao cadastrar!'
                });
            });
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}

                            <span className="text-600 font-medium">Cadastro</span>
                        </div>

                        <div>
                            <label htmlFor="nome" className="block text-900 text-xl font-medium mb-2">
                                Nome
                            </label>
                            <InputText id="nome" value={usuario.nome} onChange={(e) => onInputChange(e, 'nome')} type="text" placeholder="Insira seu nome aqui..." className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            {/* <label htmlFor="sobrenome" className="block text-900 text-xl font-medium mb-2">
                                Sobrenome
                            </label>
                            <InputText id="sobrenome" type="text" placeholder="Insira seu sobrenome aqui..." className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} /> */}
                            <label htmlFor="login" className="block text-900 text-xl font-medium mb-2">
                                Login
                            </label>
                            <InputText id="login" value={usuario.login} onChange={(e) => onInputChange(e, 'login')} type="text" placeholder="Insira seu login aqui..." className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            <label htmlFor="senha" className="block text-900 font-medium text-xl mb-2">
                                Senha
                            </label>
                            <Password inputId="senha" value={usuario.senha} onChange={(e) => onInputChange(e, 'senha')} placeholder="Insira sua senha" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                            {/* <label htmlFor="senha" className="block text-900 font-medium text-xl mb-2">
                                Confirma sua Senha
                            </label>
                            <Password inputId="confirmesenha" value={password}  onChange={(e) => setPassword(e.target.value)} placeholder="Confirme sua senha" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password> */}
                        </div>
                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => router.push('/auth/login')}>
                            Já posssui cadastro?
                        </a>
                        <div>
                            <Button label="Sign Up" className="w-full p-3 text-xl" onClick={() => newUser()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
