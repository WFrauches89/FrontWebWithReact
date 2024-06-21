/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Project } from '@/types';
import { PerfilUsuarioService } from '@/service/perfilUsuarioService';
import { UsuarioService } from '@/service/usuarioService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { PerfilService } from '@/service/perfilService';

const PerfilUsuario = () => {
    let perfilUsuarioVazio: Project.PerfilUsuario = {
        id: 0,
        perfilDTO: { descricao: '' },
        usuarioDTO: { nome: '', login: '', senha: '', email: '' }
    };

    const [perfisUsuario, setPerfisUsuario] = useState<Project.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfisUsuariosDialog, setDeletePerfisUsuariosDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Project.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfisUsuarios, setSelectedPerfisUsuarios] = useState<Project.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = new PerfilUsuarioService();
    const perfisService = useMemo(() => new PerfilService(), []);
    const usuariosService = useMemo(() => new UsuarioService(), []);
    const [usuarios, setUsuarios] = useState<Project.Usuario[]>([]);
    const [perfis, setPerfis] = useState<Project.Perfil[]>([]);

    useEffect(() => {
        if (!perfisUsuario) {
            perfilUsuarioService.getAll().then((response) => {
                setPerfisUsuario(response.data);
                console.log('getAll response:', response.data);
            });
        }
    }, [perfilUsuarioService, perfisUsuario]);

    useEffect(() => {
        if (perfilUsuarioDialog) {
            usuariosService
                .getAll()
                .then((response) => setUsuarios(response.data))
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de usuário!'
                    });
                });
            perfisService
                .getAll()
                .then((response) => setPerfis(response.data))
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de perfil!'
                    });
                });
        }
    }, [perfilUsuarioDialog, perfisService, usuariosService]);

    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfisDialog = () => {
        setDeletePerfisUsuariosDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if (!perfilUsuario.id) {
            perfilUsuarioService
                .create(perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario(null);
                    if (toast.current) {
                        toast.current.show({
                            severity: 'info',
                            summary: 'Sucesso!',
                            detail: 'Recurso cadastrado com sucesso!'
                        });
                    }
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar recurso!' + error.data.message
                    });
                });
        } else {
            perfilUsuarioService
                .update(perfilUsuario.id, perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Recurso alterado com sucesso!'
                    });
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar recurso!' + error.data.message
                    });
                });
        }
    };

    const editPerfilUsuario = (perfilUsuario: Project.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Project.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        if (perfilUsuario.id) {
            perfilUsuarioService
                .delete(perfilUsuario.id)
                .then(() => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setDeletePerfilUsuarioDialog(false);
                    setPerfisUsuario(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Recurso deletado com sucesso!'
                    });
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar recurso!' + error.data.message
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteUsuarioSelected = () => {
        setDeletePerfisUsuariosDialog(true);
    };

    const deleteSelectedsPerfisUsuarios = () => {
        Promise.all(
            selectedPerfisUsuarios.map(async (_perfisUsuarios) => {
                if (_perfisUsuarios.id) {
                    await perfilUsuarioService.delete(_perfisUsuarios.id);
                }
            })
        )
            .then((response) => {
                setPerfisUsuario(null);
                setSelectedPerfisUsuarios([]);
                setDeletePerfisUsuariosDialog(false);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Recurso deletado com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar recurso!' + error.data.message
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Omit<Project.PerfilUsuario, 'id'>) => {
        const val = (e.target && e.target.value) || '';
        setPerfilUsuario((prevState) => ({
            ...prevState,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteUsuarioSelected} disabled={!selectedPerfisUsuarios || !(selectedPerfisUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const perfilBodyTemplate = (rowData: Project.PerfilUsuario) => {
        console.log('perfilBodyTemplate rowData:' + rowData, rowData.perfilDTO?.descricao);
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfilDTO && rowData.perfilDTO.descricao ? rowData.perfilDTO.descricao : 'N/A'}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Project.PerfilUsuario) => {
        console.log('usuarioBodyTemplate rowData:' + rowData, rowData.usuarioDTO?.nome);
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.usuarioDTO && rowData.usuarioDTO.nome ? rowData.usuarioDTO.nome : 'N/A'}
            </>
        );
    };
    const idBodyTemplate = (rowData: Project.Perfil) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Perfil e Usuario</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfisDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfisDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedsPerfisUsuarios} />
        </>
    );

    const onSelectPerfilChange = (perfil: Project.Perfil) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.perfilDTO = perfil;
        setPerfilUsuario(_perfilUsuario);
    };

    const onSelectUsuarioChange = (usuario: Project.Usuario) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.usuarioDTO = usuario;
        setPerfilUsuario(_perfilUsuario);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfisUsuarios}
                        onSelectionChange={(e) => setSelectedPerfisUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis e Usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Perfil para cadastrar" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={perfilUsuario.perfilDTO} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder="Selecione um perfil..." />
                            {submitted && !perfilUsuario.perfilDTO && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="usuario">Usuário</label>
                            <Dropdown optionLabel="nome" value={perfilUsuario.usuarioDTO} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder="Selecione um usuario..." />
                            {submitted && !perfilUsuario.usuarioDTO && <small className="p-invalid">Usuário é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Are you sure you want to delete{' '}
                                    <b>
                                        {perfilUsuario.usuarioDTO.nome} and {perfilUsuario.perfilDTO.descricao}
                                    </b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfisUsuariosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfisDialogFooter} onHide={hideDeletePerfisDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Are you sure you want to delete the selected Perfis?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
