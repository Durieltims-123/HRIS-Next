"use client";
import React, { useContext, useState, useMemo, useRef, useEffect } from 'react'
import { FormElement } from '../commons/FormElement';
import { Field, FieldArray, useFormikContext } from 'formik';
import DatePicker from "../DatePicker";
import { usePDSContext } from "@/app/contexts/PDSContext"
import { Button, Tooltip } from 'flowbite-react';
import { HiDocumentAdd, HiDocumentRemove, HiUserAdd, HiUserRemove } from 'react-icons/hi';
import { date } from 'yup';
import { FormFieldError } from '../commons/FormFieldError';
import { child, eligibility, file } from '@/app/types/pds';
import { initial } from 'lodash';


function FileUpload() {
    const { setFieldValue } = useFormikContext();
    const context = usePDSContext();
    const [attachments, setAttachments] = useState<File>();
    const [files, setFiles] = useState<string[]>([]);

    return (
        <>

            <div className='col-span-4 md:col-span-4 grid md:grid-cols-10 grid-col'>

                <div className="mt-4 mx-2 col-span-10 md:col-span-10">
                    <label className='text-sm font-medium ml-2 mt-2'>Attachments<span className=' text-red-600'> *</span></label>
                    <input
                        type="file"
                        id={`attachments`}
                        name={`attachments`}
                        placeholder="Attachments"
                        className="w-full p-3 pr-12 text-sm  rounded-lg shadow-sm focus:border-sky-500"
                        accept="application/pdf"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            if (event.currentTarget.files) {
                                const file = event.currentTarget.files[0];
                                const reader = new FileReader();
                                reader.onload = (e: any) => {
                                    const base64 = e.target.result.split(',')[1];
                                    setFieldValue('attachments', base64);
                                };

                                reader.onerror = (error) => {
                                    console.error('Error reading file:', error);
                                };

                                reader.readAsDataURL(file);

                            }
                        }}
                    />
                    <FormFieldError name={`attachments`} errors={context.errors} touched={context.touched} />
                </div>
            </div>

        </>
    )
}

export default FileUpload