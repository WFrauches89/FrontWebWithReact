/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Project } from '@/types';
import { PermissaoPerfilRecursoService } from '@/service/permissaoPerfilRecursoService';
import { PerfilService } from '@/service/perfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { RecursosService } from '@/service/recursosService';

const PermissaoPerfilRecurso = () => {
    let permissaoPerfilRecursoVazio: Project.PermissaoPerfilRecurso = {
        id: 0,
        perfilDTO: { descricao: '' },
        recursosDTO: { nome: '', chave: '' }
    };

    const [permissaoPerfilRecursos, setPermissaoPerfilRecursos] = useState<Project.PermissaoPerfilRecurso[] | null>(null);
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursosDialog, setDeletePermissaoPerfilRecursosDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Project.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissaoPerfilRecursos, setSelectedPermissaoPerfilRecursos] = useState<Project.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []);
    const recursoService = useMemo(() => new RecursosService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [recursos, setRecursos] = useState<Project.Recurso[]>([]);
    const [perfis, setPerfis] = useState<Project.Perfil[]>([]);

    useEffect(() => {
        if (!permissaoPerfilRecursos) {
            permissaoPerfilRecursoService
                .getAll()
                .then((response) => {
                    console.log(response.data);
                    setPermissaoPerfilRecursos(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [permissaoPerfilRecursoService, permissaoPerfilRecursos]);

    useEffect(() => {
        if (permissaoPerfilRecursoDialog) {
            recursoService
                .getAll()
                .then((response) => setRecursos(response.data))
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de recurso!'
                    });
                });
            perfilService
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
    }, [permissaoPerfilRecursoDialog, perfilService, recursoService]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursosDialog = () => {
        setDeletePermissaoPerfilRecursosDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if (!permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService
                .create(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Permissão cadastrada com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar!' + error.data.message
                    });
                });
        } else {
            permissaoPerfilRecursoService
                .update(permissaoPerfilRecurso.id, permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Permissão alterada com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar!' + error.data.message
                    });
                });
        }
    };

    const editPermissaoPerfilRecurso = (permissaoPerfilRecurso: Project.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso({ ...permissaoPerfilRecurso });
        setPermissaoPerfilRecursoDialog(true);
    };

    const confirmDeletePermissaoPerfilRecurso = (permissaoPerfilRecurso: Project.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso);
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deletePermissaoPerfilRecurso = () => {
        console.log('deletePermissaoPerfilRecurso');
        console.log(permissaoPerfilRecurso.id);
        if (permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService
                .delete(permissaoPerfilRecurso.id)
                .then((response) => {
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Permissão deletada com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar o perfil!',
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePermissaoPerfilRecursosDialog(true);
    };

    const deleteSelectedPermissaoPerfilRecursos = () => {
        Promise.all(
            selectedPermissaoPerfilRecursos.map(async (_permissaoPerfilRecurso) => {
                if (_permissaoPerfilRecurso.id) {
                    await permissaoPerfilRecursoService.delete(_permissaoPerfilRecurso.id);
                }
            })
        )
            .then((response) => {
                setPermissaoPerfilRecursos(null);
                setSelectedPermissaoPerfilRecursos([]);
                setDeletePermissaoPerfilRecursosDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Permissao deletadas com Sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar perfis!',
                    life: 3000
                });
            });
    };

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    //     const val = (e.target && e.target.value) || '';
    //     setPermissaoPerfilRecurso(prevPermissaoPerfilRecurso => ({
    //          ...prevPermissaoPerfilRecurso,
    //          [name]: val,
    //     }));
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissaoPerfilRecursos || !(selectedPermissaoPerfilRecursos as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
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

    const perfilBodyTemplate = (rowData: Project.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfilDTO.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Project.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recursosDTO.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoPerfilRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Permissão de Perfil</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePermissaoPerfilRecurso} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPermissaoPerfilRecursos} />
        </>
    );

    const onSelectPerfilChange = (perfil: Project.Perfil) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.perfilDTO = perfil;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    const onSelectRecursoChange = (recurso: Project.Recurso) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.recursosDTO = recurso;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissaoPerfilRecursos}
                        selection={selectedPermissaoPerfilRecursos}
                        onSelectionChange={(e) => setSelectedPermissaoPerfilRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma permissãoencontrada."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Detalhes de Perfil Usuário" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={permissaoPerfilRecurso.perfilDTO} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder="Selecione um perfil..." />
                            {submitted && !permissaoPerfilRecurso.perfilDTO && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="recurso">Recurso</label>
                            <Dropdown optionLabel="nome" value={permissaoPerfilRecurso.recursosDTO} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectRecursoChange(e.value)} placeholder="Selecione um recurso..." />
                            {submitted && !permissaoPerfilRecurso.recursosDTO && <small className="p-invalid">Recurso é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePermissaoPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Você realmente deseja excluir a permissão <b>{permissaoPerfilRecurso.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePermissaoPerfilRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && <span>Você realmente deseja excluir as permissões selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;
