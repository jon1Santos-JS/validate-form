import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

export interface FormInputTypesToValidate {
    [key: string]: { input: string; errors: string[]; isEmpty: boolean };
}

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    fields?: FormInputTypesToValidate;
}

const Form: React.FC<FormProps> = ({ children, fields }) => {
    const timerUpMessage = useRef<NodeJS.Timeout>();
    const error = useRef<string>('Invalid form');
    const hasError = useRef<boolean>();
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const router = useRouter();

    const timer = () => {
        timerUpMessage.current = setTimeout(() => {
            setShowMessage(false);
        }, 2500);
    };

    const renderChildren = () => {
        const Elements = children as JSX.Element[];
        if (Elements?.length > 1)
            return Elements.map((child) => (
                <div key={child.props.label}>{child}</div>
            ));
        return children;
    };

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        hasError.current = false;

        clearTimeout(timerUpMessage.current);

        const isValid = onCheckInputFields();

        if (isValid) hasError.current = true;

        if (!hasError.current) {
            setShowMessage(false);
            router.reload();
            return;
        }

        setShowMessage(true);
        timer();
        return;
    };

    function onCheckInputFields() {
        const verificationArray: number[] = [];

        for (const field in fields) {
            if (fields[field].errors.length >= 1 || fields[field].isEmpty) {
                verificationArray.push(1);
            } else {
                verificationArray.push(0);
            }
        }
        return verificationArray.find((value) => value === 1);
    }

    return (
        <form className="c-form">
            {renderChildren()}
            {renderError()}
            <button
                className="button is-primary"
                onClick={(e) => handleClick(e)}
            >
                Submit
            </button>
        </form>
    );

    function renderError() {
        if (!showMessage) return;
        return <div className="notification is-danger">{error.current}</div>;
    }
};

export default Form;
