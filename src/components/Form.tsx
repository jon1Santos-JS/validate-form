import { Validate, ValidateObjectKeyTypes } from '@/hooks/useValidate';
import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validate?: Validate;
}

const Form: React.FC<FormProps> = ({ children, validate }) => {
    // const [hasError, onSetError] = useState(false);
    const timerUpMessage = useRef<NodeJS.Timeout>();
    const error = useRef<string>('Invalid form');
    const [hasError, setHasError] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
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

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setHasError(true);

        clearTimeout(timerUpMessage.current);

        for (const field in validate) {
            if (validate[field as ValidateObjectKeyTypes].errors.length < 1) {
                setHasError(false);
            }
        }

        if (hasError) {
            setShowMessage(true);
            timer();
            return;
        }

        if (!hasError) {
            setShowMessage(false);
            console.log('passou');
            // router.reload();
            return;
        }
    };

    return (
        <form className="c-form">
            {renderChildren()}
            {renderError()}
            <button className="button is-primary" onClick={(e) => onClick(e)}>
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
