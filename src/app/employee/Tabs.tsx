"use client";
import { Button, Tabs } from 'flowbite-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Table from "../components/Table";
import HttpService from '../../../lib/http.services';
import Drawer from '../components/Drawer';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormElement } from '@/app/components/commons/FormElement';
import { setFormikErrors } from '../../../lib/utils.service';
import { Alert } from 'flowbite-react';

// types

type row = {
    id: string,
    attributes: object[]
}

type alert = {
    type: string,
    message: string
}

// interfaces

interface IValues {
    id?: string;
    code?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffixname?: string;
    contact_number?: string;
    email_address?: string;
    current_position?: string;
    employment_status?: string;
    employee_status?: string;
    orientation_status?: string;
}


//main function

function SalaryGradeTabs() {


    // variables
    const [activeTab, setActiveTab] = useState<number>(0);
    const [activePage, setActivePage] = useState<number>(1);
    var [searchKeyword, setSearchKeyword] = useState<string>('');
    const [orderBy, setOrderBy] = useState<string>('');
    const [alerts, setAlerts] = useState<alert[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [orderAscending, setOrderAscending] = useState<boolean>(false);
    const [pagination, setpagination] = useState<number>(1);
    const [process, setProcess] = useState<string>("Add");
    const [headers, setHeaders] = useState<string[]>([
        "id",
        "code",
        "firstname",
        "middlename",
        "lastname",
        "suffixname",
        "contact number",
        "email_address",
        "current_position",
        "employment_status",
        "employee_status",
        "orientation_status"
    ]);
    const [pages, setPages] = useState<number>(1);
    const [data, setData] = useState<row[]>([]);
    const [title, setTitle] = useState<string>("Employee");
    const [id, setId] = useState<number>(0);
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    var [initialValues, setInitialValues] = useState<IValues>(
        {
            id: "",
            code: "",
            firstname: "",
            middlename: "",
            lastname: "",
            suffixname: "",
            contact_number: "",
            email_address: "",
            current_position: "",
            employment_status: "",
            employee_status: "",
            orientation_status: ""
        }
    );

    // Use Effect Hook

    useEffect(() => {
        // query
        async function getData() {
            const postData = {
                activePage: activePage,
                searchKeyword: searchKeyword,
                orderBy: orderBy,
                orderAscending: orderAscending
            };
            const resp = await HttpService.post("search-employee", postData);
            if (resp != null) {
                setData(resp.data.data);
                setPages(resp.data.pages);
            }
        }


        getData();
    }, [refresh, searchKeyword, orderBy, orderAscending, pagination, activePage]);

    useEffect(() => {
        if (id == 0) {
            setInitialValues({
                id: '',
                code: '',
                firstname: '',
                middlename: '',
                lastname: '',
                suffixname: '',
                contact_number: '',
                email_address: '',
                current_position: '',
                employment_status: '',
                employee_status: '',
                orientation_status: ''
            });
        }

    }, [id]);

    useEffect(() => {
        if (process === "Delete") {
            setAlerts([{ "type": "failure", "message": "Are you sure to delete this data?" }])
        }
        else {
            // setAlerts([]);
        }
    }, [process]);



    //    get data by id
    const getDataById = async (id: number) => {

        try {
            const resp = await HttpService.get("employee/" + id);
            console.log(resp);
            if (resp.status === 200) {
                setId(id);
                setInitialValues({
                    id: resp.data.id,
                    code: resp.data.code,
                    firstname: resp.data.firstname,
                    middlename: resp.data.middlename,
                    lastname: resp.data.lastname,
                    suffixname: resp.data.suffixname,
                    contact_number: resp.data.contact_number,
                    email_address: resp.data.current_position,
                    employment_status: resp.data.employment_status,
                    employee_status: resp.data.employee_status,
                    orientation_status: resp.data.orientation_status
                })
                setShowDrawer(true);

            }
        }
        catch (error: any) {
        }

    };


    // clear alert
    function clearAlert(key: number) {
        const temp_alerts = [...alerts];
        temp_alerts.splice(key, 1);
        setAlerts(temp_alerts);
    }


    // Submit form
    const onFormSubmit = async (
        values: IValues,
        { setSubmitting, resetForm, setFieldError }: FormikHelpers<IValues>
    ) => {
        const postData = {
            id: values.id,
            code: values.code,
            firstname: values.firstname,
            middlename: values.middlename,
            lastname: values.lastname,
            suffixname: values.suffixname,
            contact_number: values.contact_number,
            email_address: values.email_address,
            current_position: values.current_position,
            employment_status: values.employment_status,
            employee_status: values.employee_status,
            orientation_status: values.orientation_status,
            device_name: "web",
        };

        alerts.forEach(element => {
            alerts.pop();
        });

        try {
            // add
            if (process == "Add") {

                const resp = await HttpService.post("employee", postData);
                if (resp.status === 200) {
                    let status = resp.data.status;
                    if (status === "Request was Successful") {
                        alerts.push({ "type": "success", "message": "Data has been successfully saved!" });
                        setActivePage(1);
                        setRefresh(!refresh);
                    }
                    else {
                        if (typeof resp.data != "undefined") {
                            alerts.push({ "type": "failure", "message":  resp.data.message });
                        }
                    }
                }
            }
            // update
            else if (process == "Edit") {
                const resp = await HttpService.patch("employee/" + id, postData)
                if (resp.status === 200) {
                    let status = resp.data.status;
                    if (resp.data.data != "" && typeof resp.data.data != "undefined") {
                        alerts.push({ "type": "success", "message": "Data has been successfully saved!" });
                        setActivePage(1);
                        setRefresh(!refresh);
                    }
                    else {
                        if (typeof resp.data != "undefined") {
                            alerts.push({ "type": "failure", "message":  resp.data.message });
                        }
                    }
                }
            }
            // delete
            else {
                const resp = await HttpService.delete("employee/" + id);
                if (resp.status === 200) {
                    let status = resp.data.status;
                    if (status === "Request was Successful") {
                        alerts.push({ "type": "success", "message": resp.data.message });
                        setActivePage(1);
                        setRefresh(!refresh);
                        setId(0);
                        setProcess("Add");
                    }
                    else {
                        if (typeof resp.data != "undefined") {
                            alerts.push({ "type": "failure", "message":  resp.data.message });
                        }
                    }
                }
            }
        }
        catch (error: any) {
            if (error.response.status === 422) {
                setFormikErrors(error.response.data.errors, setFieldError);
            }
        }

    };



    // tsx
    return (
        <>
            {/* drawer */}
            <Drawer width='w-96' setShowDrawer={setShowDrawer} setProcess={setProcess} showDrawer={showDrawer} setId={setId} title={`${process} ${title}`}>

                {/* formik */}
                <Formik initialValues={initialValues} onSubmit={onFormSubmit} enableReinitialize={true}
                >

                    {({ errors, touched }) => (

                        // forms
                        <Form className='p-2' id="formik">
                            <div className='alert-container' id="alert-container">
                                {alerts.map((item, index) => {
                                    return (
                                        <Alert className='my-1' color={item.type} key={index} onDismiss={() => { clearAlert(index) }} > <span> <p><span className="font-medium">{item.message}</span></p></span></Alert>
                                    );
                                })}
                            </div>


                            {/* number */}
                            <FormElement
                                name="id"
                                label="ID"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="id"
                                    name="id"
                                    placeholder="Enter ID"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>
                            
                            <FormElement
                                name="code"
                                label="Code"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="code"
                                    name="code"
                                    placeholder="Enter Code"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            {/* Amount */}
                            <FormElement
                                name="firstname"
                                label="First Name"
                                errors={errors}
                                touched={touched}
                            >

                                <Field
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter First Name"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                />

                            </FormElement>

                            <FormElement
                                name="middle_name"
                                label="Middle Name"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="middle_name"
                                    name="middle_name"
                                    placeholder="Enter Middle Name"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="last_name"
                                label="Last Name"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Enter Last Nmae"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="suffix_name"
                                label="Suffix Name"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="suffix_name"
                                    name="suffix_name"
                                    placeholder="Enter Suffix Name"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="contact_number"
                                label="Contact Number"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="contact_number"
                                    name="contact_number"
                                    placeholder="Enter Contact Number"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="email_address"
                                label="Email Address"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="email_address"
                                    name="email_address"
                                    placeholder="Enter Email Address"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="current_position"
                                label="Current Position"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="current_position"
                                    name="current_position"
                                    placeholder="Enter Current Position"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="employment_status"
                                label="Employment Status"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="employment_status"
                                    name="employment_status"
                                    placeholder="Enter Employment Status"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="employmee_status"
                                label="Employmee Status"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="employmee_status"
                                    name="employmee_status"
                                    placeholder="Enter Employmee Status"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            <FormElement
                                name="orientation_status"
                                label="Orientation Status"
                                errors={errors}
                                touched={touched}
                            >
                                <Field
                                    id="orientation_status"
                                    name="orientation_status"
                                    placeholder="Enter Orientation Status"
                                    className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    onClick={() => { setAlerts([]); }}
                                />
                            </FormElement>

                            {/* submit button */}

                            <div className="grid grid-flow-row auto-rows-max mt-5">
                                <button type="submit" className={`py-2 px-4   ${(process == "Delete" ? "bg-red-500" : "bg-cyan-500")}  text-white font-semibold rounded-lg focus:scale-90 shadow-sm mx-auto`} >
                                    {(process == "Delete" ? "Delete" : "Submit")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Drawer>
            <div className={`${showDrawer ? "blur-[1px]" : ""}`}>

                {/*  Tabs */}
                <Tabs.Group
                    aria-label="Tabs with underline"
                    style="underline"
                >
                    <Tabs.Item className=' overflow-x-auto' title={title + "s"}>

                        <Button className='btn btn-sm text-white rounded-lg bg-cyan-500  hover:scale-90 shadow-sm text' onClick={() => {
                            setShowDrawer(true);
                            setId(0);
                            setProcess("Add");
                        }} onDoubleClick={() => { setShowDrawer(false); }}>Add {title}
                        </Button>


                        {/*Table*/}
                        <Table
                            searchKeyword={searchKeyword}
                            setSearchKeyword={setSearchKeyword}
                            orderBy={orderBy}
                            setOrderBy={setOrderBy}
                            orderAscending={orderAscending}
                            setOrderAscending={setOrderAscending}
                            pagination={pagination}
                            setpagination={setpagination}
                            data={data}
                            pages={pages}
                            activePage={activePage}
                            setActivePage={setActivePage}
                            headers={headers}
                            getDataById={getDataById}
                            setProcess={setProcess}
                        />
                    </Tabs.Item>
                </Tabs.Group >
            </div>
        </>
    );
}

export default SalaryGradeTabs