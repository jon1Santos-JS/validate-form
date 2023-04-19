import { Validate, ValidateObjectKeyTypes } from '@/hooks/useValidate';
import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validate?: Validate;
}

const Form: React.FC<FormProps> = ({ children, validate }) => {
    const [showError, setShowError] = useState(false);
    const timerUpMessage = useRef<NodeJS.Timeout>();
    const router = useRouter();

    const timer = (setting: (value: React.SetStateAction<boolean>) => void) => {
        timerUpMessage.current = setTimeout(() => {
            setting(false);
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

    const clearValidateArray = (key: ValidateObjectKeyTypes) => {
        if (!validate) return;
        while (validate[key].length > 0) {
            validate[key].pop();
        }
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let isValid = true;
        e.preventDefault();

        clearTimeout(timerUpMessage.current);

        for (const field in validate) {
            if (validate[field as ValidateObjectKeyTypes].length > 0) {
                isValid = false;
            }
        }

        if (isValid) {
            setShowError(false);
            router.reload();
            return;
        }

        setShowError(true);
        timer(setShowError);
    };

    return (
        <form className="c-form">
            {renderChildren()}
            {showError && (
                <div className="notification is-danger">Invalid Form</div>
            )}
            <button className="button is-primary" onClick={(e) => onClick(e)}>
                Submit
            </button>
        </form>
    );
};

export default Form;
