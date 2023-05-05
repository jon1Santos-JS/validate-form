import FormContext from '@/context/FormContext';
import useObjecthandler from '@/hooks/useObjectHandler';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export interface FormInputTypesToValidate {
    [key: string]: { errors: string[]; isEmpty: boolean; value: string };
}

interface FormInputTypeWithAuniqueProp {
    [key: string]: { value?: string };
}

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validateAll: () => void;
    method: 'POST' | 'GET';
    action: string;
    inputs: FormInputTypesToValidate;
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
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [showInputErrorsMessages, setshowInputErrorsMessages] =
        useState(false);
    const { onOmitProp } = useObjecthandler();
    const nextRouter = useRouter();

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setshowInputErrorsMessages(false);
            setShowErrorMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showInputErrorsMessages]);

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
                    value={{
                        showInputErrorsMessagesByForm: showInputErrorsMessages,
                    }}
                >
                    {inputs.map((child) => (
                        <div key={child.props.label}>{child}</div>
                    ))}
                </FormContext.Provider>
            );
        }
        return (
            <FormContext.Provider
                value={{
                    showInputErrorsMessagesByForm: showInputErrorsMessages,
                }}
            >
                {children}
            </FormContext.Provider>
        );
    }

    function renderError() {
        if (!showErrorMessage) return null;
        return <div className="notification is-danger">{'Invalid form'}</div>;
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        validateAll();
        setShowErrorMessage(true);
        setshowInputErrorsMessages(true);
        if (!onCheckInputs()) {
            setshowInputErrorsMessages(false);
            setShowErrorMessage(false);
            onSubmitInputs();
            // nextRouter.reload();
            return;
        }
    }

    function onCheckInputs() {
        const verificationArray = [];
        for (const i in inputs) {
            if (inputs[i].errors?.length >= 1 || inputs[i].isEmpty) {
                verificationArray.push(1);
            } else {
                verificationArray.push(0);
            }
        }
        return verificationArray.find((value) => value === 1);
    }

    function onSubmitInputs() {
        const formatedInputs = onHandleInputs();
        fetch(action, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formatedInputs),
        });
    }

    function onHandleInputs() {
        const inputKeys = Object.keys(inputs).filter((key) =>
            key.includes('confirm'),
        );
        const inputsWithoutConfirmFields = onOmitProp<
            FormInputTypesToValidate,
            FormInputTypeWithAuniqueProp
        >(inputs, [...inputKeys]);

        for (const i in inputsWithoutConfirmFields) {
            inputsWithoutConfirmFields[i] = onOmitProp<
                FormInputTypeWithAuniqueProp,
                FormInputTypeWithAuniqueProp
            >(inputsWithoutConfirmFields[i] as FormInputTypeWithAuniqueProp, [
                'isEmpty',
                'errors',
                'validations',
            ]);
        }

        return inputsWithoutConfirmFields;
    }
};

export default Form;
