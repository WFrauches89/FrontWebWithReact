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
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Project } from '@/types';
import { RecursosService } from '@/service/recursosService';

const Recursos = () => {
    let recursoVazio: Project.Recurso = {
        id: 0,
        nome: '',
        chave: ''
    };

    const [recursos, setRecursos] = useState<Project.Recurso[]>([]);
    const [apiCalled2, setApiCalled2] = useState(false);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Project.Recurso>(recursoVazio);
    const [selectedRecursos, setSelectedRecursos] = useState<Project.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const recursosService = new RecursosService();

    useEffect(() => {
        if (!apiCalled2) {
            recursosService
                .getAll()
                .then((response) => {
                    setRecursos(response.data);
                })
                .catch((error) => console.log(error))
                .finally(() => setApiCalled2(true));
        }
    }, [apiCalled2]);

    const openNew = () => {
        setRecurso(recursoVazio);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };

    const saveRecurso = () => {
        setSubmitted(true);

        if (!recurso.id) {
            recursosService
                .create(recurso)
                .then((response) => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setApiCalled2(false);
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
            recursosService
                .update(recurso.id, recurso)
                .then((response) => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setApiCalled2(false);
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

    const editRecurso = (recurso: Project.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (recurso: Project.Recurso) => {
        setRecurso(recurso);
        setDeleteRecursoDialog(true);
    };

    const deleteRecurso = () => {
        if (recurso.id) {
            recursosService
                .delete(recurso.id)
                .then(() => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setDeleteRecursoDialog(false);
                    setApiCalled2(false);
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

    const confirmDeleteSelected = () => {
        setDeleteRecursosDialog(true);
    };

    const deleteSelectedsRecursos = () => {
        console.log('Deleting selected');
        console.log(selectedRecursos);
        Promise.all(
            selectedRecursos.map(async (_recursos) => {
                if (_recursos.id) {
                    await recursosService.delete(_recursos.id);
                }
            })
        )
            .then((response) => {
                setApiCalled2(false);
                setSelectedRecursos([]);
                setDeleteRecursosDialog(false);
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

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof Omit<Project.Recurso, 'id'>) => {
        const val = (e.target && e.target.value) || '';
        setRecurso((prevState) => ({
            ...prevState,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !(selectedRecursos as any).length} />
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

    const idBodyTemplate = (rowData: Project.Recurso) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Project.Recurso) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const chaveBodyTemplate = (rowData: Project.Recurso) => {
        return (
            <>
                <span className="p-column-title">Chave</span>
                {rowData.chave}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.Recurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const recursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );
    const deleteRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );
    const deleteRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedsRecursos} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} recursos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="chave" header="Chave" sortable body={chaveBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Detalhes de usuário" modal className="p-fluid" footer={recursoDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={recurso.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.nome
                                })}
                            />
                            {submitted && !recurso.nome && <small className="p-invalid">Nome requirido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="chave">Chave</label>
                            <InputText
                                id="chave"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.chave
                                })}
                            />
                            {submitted && !recurso.chave && <small className="p-invalid">Chave obrigatória.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursoDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && (
                                <span>
                                    Are you sure you want to delete <b>{recurso.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursosDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Are you sure you want to delete the selected RECURSOS?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recursos;
