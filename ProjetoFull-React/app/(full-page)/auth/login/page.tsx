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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const loginService = useMemo(() => new LoginService(), []);

    const toast = useRef<Toast>(null);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const rota = () => {
        router.push('/pages/crud');
    };

    const loginExec = () => {
        loginService
            .logar(username, password)
            .then((response) => {
                localStorage.setItem('TOKEN_APLICACAO_FRONTEND', response.data.token);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Usuário logado com sucesso!',
                    sticky: true
                });

                setTimeout(() => {
                    rota();
                }, 5000);
                window.location.reload();
            })
            .catch(() => {
                console.log('Error');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Login ou Senha estão inválidos!'
                });

                setUsername('');
                setPassword('');
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
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                Username
                            </label>
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username aqui" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password aqui" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => router.push('/auth/newUser')}>
                                    Cadastre-se aqui!
                                </a>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => rota()}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={() => loginExec()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
