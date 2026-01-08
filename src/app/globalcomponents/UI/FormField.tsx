"use client";

import React from "react";

interface FormFielProps {

    //texto del label 
    label: string;

    //Marca el campo como obligatorio
    required?: boolean;

    //Mensaje de error 
    error?: string;

    //Mensaje de ayuda 
    helpText?: string;

    //Campo del formulario de inputs, select o textarea
    children: React.ReactNode;
}

export function FormField({
    label,
    required = false,
    error,
    helpText,
    children,
}: FormFielProps) {
    return (
        <div className="form-field">
            <label className="forms-field__label">
                {label}
                {required && <span className="forms-field__required">*</span>}
            </label>

        <div className="form-field__control">
            {children}
        </div>

        {error ?(
            <small className="form-field__error">
                {error}
            </small>
        ) : (
            helpText && (
                <small className="forms-field__help ">
                    {helpText} 
                </small>
        )
        )}    
        </div>
    );
}


