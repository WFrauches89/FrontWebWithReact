'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { useEffect, useState } from 'react';
import { TRACE_OUTPUT_VERSION } from 'next/dist/shared/lib/constants';
import LoginPage from './(full-page)/auth/login/page';
import NewUserPage from './(full-page)/auth/newUser/page';
import { usePathname } from 'next/navigation';

interface RootLayoutProps {
    children: React.ReactNode;
}

const authContextCheck = () => {
    if (localStorage.getItem('TOKEN_APLICACAO_FRONTEND') != undefined) return true;
    else return false;
};

export default function RootLayout({ children }: RootLayoutProps) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [auth, setAuth] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        if (pathName.startsWith('/pages') || pathName == '/') {
            setAuth(authContextCheck());
            setPageLoaded(true);
        } else {
            setAuth(true);
            setPageLoaded(true);
        }
    }, [pathName]);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                {auth ? (
                    <PrimeReactProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </PrimeReactProvider>
                ) : pageLoaded ? (
                    <PrimeReactProvider>
                        <LayoutProvider>
                            <LoginPage />
                        </LayoutProvider>
                    </PrimeReactProvider>
                ) : null}
            </body>
        </html>
    );
}
