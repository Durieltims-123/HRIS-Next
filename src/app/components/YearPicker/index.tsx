import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";


import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
type Props = {
    id: string,
    name: string,
    placeholder: string,
    className: string,
    initialValues: any,
    setValues: Function
}


function index(parameter: Props) {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(parameter);
    const renderYearContent = (year: number) => {
        const tooltipText = `Tooltip for year: ${year}`;
        return <span title={tooltipText}>{year}</span>;
    };
    if (typeof (field.value) == "number") {
        field.value = new Date(field.value + "-01-01");
    }
    return (
        <DatePicker
            {...field}
            id={parameter.id}
            name={parameter.name}
            className={parameter.className}
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, val);
            }}
            showYearPicker
            dateFormat="yyyy"
        />
    );
}

export default index