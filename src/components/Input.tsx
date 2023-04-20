import React, { useState, useEffect, useRef } from 'react';

interface InputProps {
    label: string;
    typeInput: string;
    validation?: (e: string) => string[];
}

const Input: React.FC<InputProps> = ({ label, typeInput, validation }) => {
    const [input, setInput] = useState('');
    const [errors, setErrors] = useState<string[] | null | undefined>();
    const typingTimer = useRef<NodeJS.Timeout>();
    const inputFirstState = useRef(input);

    useEffect(() => {
        typingTimer.current = setTimeout(() => {
            setErrorsList();
        }, 650);

        return () => clearTimeout(typingTimer.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    return (
        <div className="field">
            <label className="label">{label}: </label>
            <input
                className="input"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type={typeInput}
            />
            {renderErrors()}
        </div>
    );

    function setErrorsList() {
        if (inputFirstState.current !== input)
            setErrors(validation && validation(input));
        if (errors && errors.length < 1) setErrors(null);
    }

    function renderErrors() {
        if (!errors) return;

        return errors.map((err) => (
            <div className="has-text-danger" key={err}>
                {err}
            </div>
        ));
    }
};

export default Input;
