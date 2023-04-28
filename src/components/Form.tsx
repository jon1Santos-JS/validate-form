import FormContext from '@/context/FormContext';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export interface FormInputTypesToValidate {
    [key: string]: { errors: string[]; isEmpty: boolean };
}

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    fields?: FormInputTypesToValidate;
}

const Form: React.FC<FormProps> = ({ children, fields }) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showInputErrors, setshowInputErrors] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setshowInputErrors(false);
            setShowMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showInputErrors]);

    return (
        <form className="c-form">
            {renderInputs()}
            {renderError()}
            <button
                className="button is-primary"
                onClick={(e) => handleClick(e)}
            >
                Submit
            </button>
        </form>
    );

    function renderInputs() {
        const inputs = children as JSX.Element[];
        if (inputs?.length > 1) {
            return (
                <FormContext.Provider
                    value={{ showInputErrorsByForm: showInputErrors }}
                >
                    {inputs.map((child) => (
                        <div key={child.props.label}>{child}</div>
                    ))}
                </FormContext.Provider>
            );
        }
        return (
            <FormContext.Provider
                value={{ showInputErrorsByForm: showInputErrors }}
            >
                {children}
            </FormContext.Provider>
        );
    }

    function renderError() {
        if (!showMessage) return null;
        return <div className="notification is-danger">{'Invalid form'}</div>;
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        HandleInputs();
    }

    function HandleInputs() {
        setShowMessage(true);
        setshowInputErrors(true);
        if (!onCheckInputFields()) {
            setshowInputErrors(false);
            setShowMessage(false);
            router.reload();
            return;
        }
    }

    function onCheckInputFields() {
        const verificationArray = [];
        for (const index in fields) {
            if (fields[index].errors.length >= 1 || fields[index].isEmpty) {
                verificationArray.push(1);
            } else {
                verificationArray.push(0);
            }
        }
        return verificationArray.find((value) => value === 1);
    }
};

export default Form;
