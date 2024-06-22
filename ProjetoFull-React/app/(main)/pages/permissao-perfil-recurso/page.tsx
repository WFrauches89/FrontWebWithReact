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
import { PermissaoPerfilRecursoService } from '@/service/permissaoPerfilRecursoService';
import { RecursosService } from '@/service/recursosService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { PerfilService } from '@/service/perfilService';
import { FileUpload } from 'primereact/fileupload';

const PermissaoPerfilRecurso = () => {
    let permissaoPerfilRecursoVazio: Project.PermissaoPerfilRecurso = {
        id: 0,
        perfilDTO: { descricao: '' },
        recursosDTO: { nome: '', chave: '' }
    };

    const [permissoesPerfis, setPermissoesPerfis] = useState<Project.PermissaoPerfilRecurso[] | null>(null);
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissoesPerfisRecursosDialog, setDeletePermissoesPerfisRecursosDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Project.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissaoPerfilRecurso, setSelectedPermissaoPerfilRecurso] = useState<Project.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []); //uma alteração
    const perfisService = useMemo(() => new PerfilService(), []);
    const recursosService = useMemo(() => new RecursosService(), []);
    const [recursos, setRecursos] = useState<Project.Recurso[]>([]);
    const [perfis, setPerfis] = useState<Project.Perfil[]>([]);
    const [apiCalled, setApiCalled] = useState(false);

    useEffect(() => {
        if (!permissoesPerfis) {
            permissaoPerfilRecursoService
                .getAll()
                .then((response) => {
                    setPermissoesPerfis(response.data);
                    console.log('getAll response:', response.data);
                })
                .catch((error) => {
                    console.error('Erro ao carregar permissões, perfis e recursos:', error);
                });
        }
    }, [permissoesPerfis, permissaoPerfilRecursoService]);

    useEffect(() => {
        if (permissaoPerfilRecursoDialog) {
            recursosService
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
    }, [permissaoPerfilRecursoDialog, perfisService, recursosService]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePerfisRecursosDialog = () => {
        setDeletePermissoesPerfisRecursosDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if (!permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService
                .create(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissoesPerfis(null);

                    if (toast.current) {
                        toast.current.show({
                            severity: 'info',
                            summary: 'Sucesso!',
                            detail: 'Perfil e Recurso cadastrados com sucesso!'
                        });
                    }
                })
                .catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar perfil e recurso!' + error.data.message
                    });
                });
        } else {
            permissaoPerfilRecursoService
                .update(permissaoPerfilRecurso.id, permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissoesPerfis(null);

                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil e/ou Recurso alterado com sucesso!'
                    });
                })
                .catch((error) => {
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
                .then(() => {
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissoesPerfis(null);

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

    const confirmDeletePermissaoPerfilRecursoSelected = () => {
        setDeletePermissoesPerfisRecursosDialog(true);
    };

    const deleteSelectedsPermissoesPerfisRecursos = () => {
        Promise.all(
            selectedPermissaoPerfilRecurso.map(async (_permissoesPerfisRecursos) => {
                if (_permissoesPerfisRecursos.id) {
                    await permissaoPerfilRecursoService.delete(_permissoesPerfisRecursos.id);
                }
            })
        )
            .then((response) => {
                setPermissoesPerfis(null);

                setSelectedPermissaoPerfilRecurso([]);
                setDeletePermissoesPerfisRecursosDialog(false);
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

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Omit<Project.PermissaoPerfilRecurso, 'id'>) => {
    //     const val = (e.target && e.target.value) || '';
    //     setPermissaoPerfilRecurso((prevState) => ({
    //         ...prevState,
    //         [name]: val
    //     }));
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeletePermissaoPerfilRecursoSelected} disabled={!selectedPermissaoPerfilRecurso || !(selectedPermissaoPerfilRecurso as any).length} />
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

    const perfilBodyTemplate = (rowData: Project.PermissaoPerfilRecurso) => {
        // console.log('perfilBodyTemplate rowData:' + rowData, rowData.perfilDTO?.descricao);
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfilDTO.descricao}
                {/* {rowData.perfilDTO && rowData.perfilDTO.descricao ? rowData.perfilDTO.descricao : 'N/A'} */}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Project.PermissaoPerfilRecurso) => {
        // console.log('usuarioBodyTemplate rowData:' + rowData, rowData.recursosDTO?.nome);
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recursosDTO.nome}
                {/* {rowData.recursosDTO && rowData.recursosDTO.nome ? rowData.recursosDTO.nome : 'N/A'} */}
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
            <h5 className="m-0">Gerenciamento de Perfil e Recurso</h5>
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
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePerfisDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfisRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedsPermissoesPerfisRecursos} />
        </>
    );

    const onSelectPerfilChange = (perfil: Project.Perfil) => {
        let _perfilRecurso = { ...permissaoPerfilRecurso };
        _perfilRecurso.perfilDTO = perfil;
        setPermissaoPerfilRecurso(_perfilRecurso);
    };

    const onSelectUsuarioChange = (recurso: Project.Recurso) => {
        let _perfilRecurso = { ...permissaoPerfilRecurso };
        _perfilRecurso.recursosDTO = recurso;
        setPermissaoPerfilRecurso(_perfilRecurso);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissoesPerfis}
                        selection={selectedPermissaoPerfilRecurso}
                        onSelectionChange={(e) => setSelectedPermissaoPerfilRecurso(e.value as any)} //Project.PermissaoPerfilRecurso[]
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis e recursos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum perfil e recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Perfil e Recurso para cadastrar" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={permissaoPerfilRecurso.perfilDTO} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder="Selecione um perfil..." />
                            {submitted && !permissaoPerfilRecurso.perfilDTO && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="usuario">Usuário</label>
                            <Dropdown optionLabel="nome" value={permissaoPerfilRecurso.recursosDTO} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder="Selecione um recurso..." />
                            {submitted && !permissaoPerfilRecurso.recursosDTO && <small className="p-invalid">Usuário é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Are you sure you want to delete{' '}
                                    <b>
                                        {permissaoPerfilRecurso.recursosDTO.nome} and {permissaoPerfilRecurso.perfilDTO.descricao}
                                    </b>
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissoesPerfisRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfisDialogFooter} onHide={hideDeletePerfisRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && <span>Are you sure you want to delete the selected Perfis?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;
