"use client";

export type formContextType = {
    readonly?: boolean,
    updateAddress: Function,
    errors: any,
    touched: any,
    isEmployee?: boolean,
    initialValues: IValues,
    setValues: Function,
};

export type country = {
    value: string,
    label: string,
};


// interfaces

export interface IValues {
    employee_id: string;
    date_approved: string,
    date_queued: string,
    birth_date: string;
    position: string;
    position_autosuggest: string;
    status: string;
    posting_date: string,
    closing_date: string,
}