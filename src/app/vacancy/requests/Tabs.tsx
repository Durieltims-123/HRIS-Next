"use client";
import { Button, Tabs, TabsRef } from 'flowbite-react';
import React, { ReactNode, useEffect, useRef } from 'react';
import { useState } from 'react';
import Table from "../../components/Table";
import HttpService from '../../../../lib/http.services';
import Drawer from '../../components/Drawer';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormElement } from '@/app/components/commons/FormElement';
import { setFormikErrors } from '../../../../lib/utils.service';
import { Alert } from 'flowbite-react';
import dayjs from 'dayjs';
import DatePicker from '../../components/DatePicker'
import DataList from '@/app/components/DataList';
import { ArrowRightIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { useRouter } from "next/navigation";



// types

type row = {
    id: string,
    attributes: object[]
}

type alert = {
    type: string,
    message: string
}

type header = {
    column: string,
    display: string
}

type datalist = {
    id: string,
    label: any
}

type button = {
    icon: ReactNode,
    title: string,
    process: string,
    class: string
}


// interfaces

interface IValues {
    date_submitted: string;
    date_approved: string,
    date_queued: string,
    position_id: string;
    position: string;
    position_autosuggest: string;
    status: string;
    scheduled_opening: string,
    scheduled_closing: string,
}


//main function

function AllRequestsTabs() {


    // variables
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<number>(1);
    const tabsRef = useRef<TabsRef>(null);
    const props = { setActiveTab, tabsRef };
    // props.setActiveTab(1);
    const [activePage, setActivePage] = useState<number>(1);
    var [searchKeyword, setSearchKeyword] = useState<string>('');
    const [orderBy, setOrderBy] = useState<string>('');
    const [alerts, setAlerts] = useState<alert[]>([]);
    const [buttons, setButtons] = useState<button[]>([
        { "icon": <HandThumbUpIcon className=' w-5 h-5' />, "title": "Approve", "process": "Approve", "class": "text-green-500" },
        { "icon": <ArrowRightIcon className=' w-5 h-5' />, "title": "Queue", "process": "Queue", "class": "text-slate-500" }
    ]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [orderAscending, setOrderAscending] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [pagination, setpagination] = useState<number>(1);
    const [process, setProcess] = useState<string>("Add");
    const [year, setYear] = useState<number>(parseInt(dayjs().format('YYYY')));
    const [headers, setHeaders] = useState<header[]>([
        { "column": "id", "display": "id" },
        { "column": "date_submitted", "display": "Date Submitted" },
        { "column": "title", "display": "Position" },
        { "column": "department_name", "display": "Department" },
        { "column": "office_name", "display": "Office" },
        { "column": "description", "display": "Description" },
        { "column": "item_number", "display": "Plantilla" },
        { "column": "number", "display": "Salary Grade" },
        { "column": "amount", "display": "Monthly Salary" },
        { "column": "education", "display": "education" },
        { "column": "training", "display": "training" },
        { "column": "experience", "display": "experience" },
        { "column": "eligibility", "display": "eligibility" },
        { "column": "competency", "display": "competency" },
    ]);
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [pages, setPages] = useState<number>(1);
    const [data, setData] = useState<row[]>([]);
    const [title, setTitle] = useState<string>("Request");
    const [positionKeyword, setPositionKeyword] = useState<string>("");
    const [positionData, setPositionData] = useState<datalist[]>([]);
    const [id, setId] = useState<number>(0);
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    var [initialValues, setValues] = useState<IValues>(
        {
            date_submitted: '',
            position_id: '',
            position: '',
            position_autosuggest: '',
            status: '',
            date_approved: '',
            date_queued: '',
            scheduled_opening: '',
            scheduled_closing: '',
        }
    );


    function resetFormik() {
        setValues({
            date_submitted: '',
            position_id: '',
            position: '',
            position_autosuggest: '',
            status: '',
            date_approved: '',
            date_queued: '',
            scheduled_opening: '',
            scheduled_closing: '',
        });
    }

    // Use Effect Hook


    useEffect(() => {
        // query
        async function getData() {
            const postData = {
                activePage: activePage,
                searchKeyword: searchKeyword,
                orderBy: orderBy,
                year: year,
                orderAscending: orderAscending,
                filter: ['vacancies.status', "Active"]
            };
            const resp = await HttpService.post("search-vacancy", postData);
            if (resp != null) {
                setData(resp.data.data);
                setPages(resp.data.pages);
            }
        }
        getData();
    }, [refresh, searchKeyword, orderBy, orderAscending, pagination, activePage, year]);


    // Get LGU Positions
    useEffect(() => {
        // query
        async function getLGUPositions() {
            const postData = {
                activePage: 1,
                searchKeyword: positionKeyword,
                orderBy: 'title',
                year: '',
                orderAscending: "asc",
                positionStatus: ['Permanent'],
                status: ['Active'],
                viewAll: false
            };
            const resp = await HttpService.post("search-lgu-position", postData);
            if (resp != null) {
                setPositionData(
                    resp.data.data.map((data: any) => {
                        return {
                            "id": data.id,
                            "label": data.attributes.label
                        }
                    })
                );
            }
        }
        getLGUPositions();
    }, [positionKeyword]);


    useEffect(() => {
        if (id == 0) {
            setValues({
                date_submitted: '',
                position_id: '',
                position: '',
                position_autosuggest: '',
                status: '',
                date_approved: '',
                date_queued: '',
                scheduled_opening: '',
                scheduled_closing: '',

            });
        }
    }, [id]);

    useEffect(() => {
        if (process === "Delete") {
            setAlerts([{ "type": "failure", "message": "Are you sure to delete this data?" }]);
            setReadOnly(true);
        }
        else if (process === "Approve") {
            setAlerts([{ "type": "info", "message": "Approve Request?" }])
            setReadOnly(true);
        }
        else if (process === "Queue") {
            setAlerts([{ "type": "warning", "message": "Queue Request?" }])
            setReadOnly(true);
        }
        else {
            setAlerts([]);
            setReadOnly(false);
        }
    }, [process]);


    //    get data by id
    const getDataById = async (id: number) => {

        try {
            const resp = await HttpService.get("vacancy/" + id);
            if (resp.status === 200) {
                let data = resp.data;
                setId(id);
                setValues({
                    date_submitted: (dayjs(data.date_submitted).format('MM/DD/YYYY')),
                    position_id: data.lgu_position_id,
                    position: `${data.title} - ${data.item_number}`,
                    position_autosuggest: `${data.title} - ${data.item_number}`,
                    status: data.status,
                    date_approved: data.approved,
                    date_queued: data.queued,
                    scheduled_opening: '',
                    scheduled_closing: '',
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
        values: any,
        { setSubmitting, resetForm, setFieldError }: FormikHelpers<IValues>
    ) => {
        setLoading(true);
        const postData = {
            date_submitted: values.date_submitted,
            date_approved: values.date_approved,
            date_queued: values.date_queued,
            scheduled_opening: values.scheduled_opening,
            scheduled_closing: values.scheduled_closing,
            position_id: values.position_id,
            position: values.position,
            device_name: "web",
            process: process,
            status: "Active"
        };

        alerts.forEach(element => {
            alerts.pop();
        });


        try {
            // add
            if (process === "Add") {
                const resp = await HttpService.post("vacancy", postData);
                if (resp.status === 200) {
                    let status = resp.data.status;
                    if (status === "Request was Successful") {
                        alerts.push({ "type": "success", "message": "Data has been successfully saved!" });
                        resetForm({});
                        resetFormik();
                        setActivePage(1);
                        setRefresh(!refresh);
                        setId(0);
                        setProcess("Add");
                    }
                    else {
                        if (typeof resp.data != "undefined") {
                            alerts.push({ "type": "failure", "message": resp.data.message });
                        }
                    }
                }
            }
            // update
            else if (process === "Edit") {

                const resp = await HttpService.patch("vacancy/" + id, postData)
                if (resp.status === 200) {
                    let status = resp.data.status;
                    if (resp.data.data != "" && typeof resp.data.data != "undefined") {
                        alerts.push({ "type": "success", "message": "Data has been successfully saved!" });
                        setActivePage(1);
                        setRefresh(!refresh);
                    }
                    else {
                        if (typeof resp.data != "undefined") {
                            alerts.push({ "type": "failure", "message": resp.data.message });
                        }
                    }
                }
            }

            // approve and queue
            else if (process === "Approve" || process === "Queue") {
                if (id != 0) {
                    if (process === "Approve") {
                        postData.status = "Approved";
                    }
                    if (process == "Queue") {
                        postData.status = "Queued";
                    }
                    const resp = await HttpService.patch("vacancy/" + id, postData)
                    if (resp.status === 200) {
                        let status = resp.data.status;
                        if (resp.data.data != "" && typeof resp.data.data != "undefined") {
                            alerts.push({ "type": "success", "message": `Data has been  successfully ${postData.status} !` });
                            resetForm({});
                            resetFormik();
                            setActivePage(1);
                            setRefresh(!refresh);
                            setId(0);
                        }
                        else {
                            if (typeof resp.data != "undefined") {
                                alerts.push({ "type": "failure", "message": resp.data.message });
                            }
                        }
                    }
                }
                else {
                    setProcess("Add");
                }
            }

            // delete
            else {
                if (id != 0) {
                    const resp = await HttpService.delete("vacancy/" + id);
                    if (resp.status === 200) {
                        let status = resp.data.status;
                        if (status === "Request was Successful") {
                            alerts.push({ "type": "success", "message": resp.data.message });
                            setActivePage(1);
                            setRefresh(!refresh);
                            setId(0);

                        }
                        else {
                            if (typeof resp.data != "undefined") {
                                alerts.push({ "type": "failure", "message": resp.data.message });
                            }
                        }
                    }
                }
                else {
                    setProcess("Add");
                    // setShowDrawer(false);
                }
            }
        }
        catch (error: any) {
            if (error.response.status === 422) {
                setFormikErrors(error.response.data.errors, setFieldError);
            }
        }

        setLoading(false);

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

                            {/* Date Submitted */}
                            <div className="">
                                <FormElement
                                    name="date_submitted"
                                    label="Date Submitted *"
                                    errors={errors}
                                    touched={touched}
                                >

                                    <DatePicker
                                        initialValues={initialValues}
                                        readOnly={`${process === "Add" || process === "Edit" ? false : true}`}
                                        setValues={setValues}
                                        name="date_submitted"
                                        placeholder="Enter Date"
                                        className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    />
                                </FormElement>
                            </div>


                            {/* Date Approved */}
                            <div className={`${process === "Approve" ? "" : "hidden"}`}>
                                <FormElement
                                    name="date_approved"
                                    label="Date Approved *"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <DatePicker
                                        initialValues={initialValues}
                                        setValues={setValues}
                                        name="date_approved"
                                        placeholder="Enter Date"
                                        className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    />
                                </FormElement>

                                <FormElement
                                    name="scheduled_opening"
                                    label="Scheduled Opening*"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <DatePicker
                                        initialValues={initialValues}
                                        setValues={setValues}
                                        name="scheduled_opening"
                                        placeholder="Enter Date"
                                        className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    />
                                </FormElement>

                                <FormElement
                                    name="scheduled_closing"
                                    label="Scheduled Closing*"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <DatePicker
                                        initialValues={initialValues}
                                        setValues={setValues}
                                        name="scheduled_closing"
                                        placeholder="Enter Date"
                                        className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    />
                                </FormElement>
                            </div>


                            {/* Date Queued */}
                            <div className={`${process === "Queue" ? "" : "hidden"}`}>
                                <FormElement
                                    name="date_queued"
                                    label="Date Queued *"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <DatePicker
                                        initialValues={initialValues}
                                        setValues={setValues}
                                        name="date_queued"
                                        placeholder="Enter Date"
                                        className="w-full p-4 pr-12 text-sm border border-gray-100 rounded-lg shadow-sm focus:border-sky-500"
                                    />
                                </FormElement>
                            </div>

                            {/* positions */}
                            <DataList errors={errors} touched={touched}
                                readonly={readOnly}
                                id="position_id"
                                setKeyword={setPositionKeyword}
                                label="Position *"
                                title="Position"
                                name="position"
                                initialValues={initialValues}
                                setValues={setValues}
                                data={positionData} />

                            {/* submit button */}

                            <div className="grid grid-flow-row auto-rows-max mt-5">
                                <button type={(isLoading ? "button" : "submit")} className={`py-2 px-4   ${(process == "Delete" ? "bg-red-500" : "bg-cyan-500")}  text-white font-semibold rounded-lg focus:scale-90 shadow-sm mx-auto`} >
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
                    ref={props.tabsRef}
                    onActiveTabChange={(tab) => {
                        if (tab == 1) {
                            router.push('/vacancy/approved');
                        }
                        else if (2) {
                            router.push('/vacancy/queued');
                        }

                    }}

                >

                    <Tabs.Item title={title + "s"} active>

                        <Button className='btn btn-sm text-white rounded-lg bg-cyan-500  hover:scale-90 shadow-sm text' onClick={() => {
                            setShowDrawer(true);
                            setId(0);
                            setProcess("Add");
                        }} onDoubleClick={() => { setShowDrawer(false); }}>Add {title}
                        </Button>

                        {/*Table*/}
                        <Table
                            buttons={buttons}
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
                            year={year}
                            setYear={setYear}
                        >
                        </Table>

                    </Tabs.Item>

                    <Tabs.Item title={"Approved Requests"}>
                    </Tabs.Item>



                    <Tabs.Item title={"Queued Requests"}>
                    </Tabs.Item>
                </Tabs.Group >

            </div >
        </>
    );
}

export default AllRequestsTabs