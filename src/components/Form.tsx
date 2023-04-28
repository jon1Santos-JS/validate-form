import FormContext from '@/context/FormContext';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export interface FormInputTypesToValidate {
    [key: string]: { errors: string[]; isEmpty: boolean };
}

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validateAll: () => void;
    method: 'POST' | 'GET';
    action: string;
    inputs?: FormInputTypesToValidate;
    legend?: string;
}

const Form: React.FC<FormProps> = ({
    children,
    validateAll,
    method,
    action,
    inputs,
    legend,
}) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showInputErrors, setshowInputErrors] = useState(false);
    const nextRouter = useRouter();

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setshowInputErrors(false);
            setShowMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showInputErrors]);

    return (
        <form className="c-form">
            <fieldset>
                <legend>{legend}</legend>
                {renderInputs()}
                {renderError()}
                <button
                    className="button is-primary"
                    onClick={(e) => handleClick(e)}
                >
                    Submit
                </button>
            </fieldset>
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
        validateAll();
        setShowMessage(true);
        setshowInputErrors(true);
        if (!onCheckInputFields()) {
            setshowInputErrors(false);
            setShowMessage(false);
            onSendInputs();
            nextRouter.reload();
            return;
        }
    }

    function onCheckInputFields() {
        const verificationArray = [];
        for (const index in inputs) {
            if (inputs[index].errors.length >= 1 || inputs[index].isEmpty) {
                verificationArray.push(1);
            } else {
                verificationArray.push(0);
            }
        }
        return verificationArray.find((value) => value === 1);
    }

    function onSendInputs() {
        fetch(action, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        });
    }
};

export default Form;
