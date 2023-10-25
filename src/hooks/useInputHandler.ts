import { onOmitProps } from '@/lib/lodashAdapter';
import { useEffect, useState } from 'react';

export const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'validations',
    'required',
    'crossfield',
];

export default function useInputHandler() {
    const [timeoutToClear, onSetTimeoutToClear] =
        useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!timeoutToClear) return;
        return () => clearTimeout(timeoutToClear);
    }, [timeoutToClear]);

    async function onSetTimeOut(cb: () => void, timer: number) {
        const timeOut = setTimeout(() => {
            cb();
        }, timer);
        onSetTimeoutToClear(timeOut);
    }

    function omitFields<T extends string>(
        obj: HandledInputsType<T>,
        fieldsToOmit: (keyof ValidateInputType<T>)[],
    ) {
        const handleInputs = { ...obj };
        for (const i in handleInputs) {
            const typedIndex = i as T;
            handleInputs[typedIndex] = onOmitProps(
                handleInputs[typedIndex],
                fieldsToOmit,
            );
        }
        return handleInputs;
    }

    function inputsFactory<T extends string, G extends T>({
        validations,
        required,
        crossfield,
        files,
    }: {
        validations?: ValidateFunctionType<T>;
        required?: string | boolean;
        crossfield?: G;
        files?: FileList | null;
    }): ValidateInputType<T> {
        return {
            validations,
            value: '',
            errors: [],
            required,
            crossfield,
            files,
        };
    }

    function inputStateFactory<T extends string>({
        onShowInputMessage,
        onHighlightInput,
    }: {
        onShowInputMessage: (value: boolean, key: T) => void;
        onHighlightInput: (value: boolean, key: T) => void;
    }) {
        return {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage,
            onHighlightInput,
        };
    }

    return {
        omitFields,
        onSetTimeOut,
        inputsFactory,
        inputStateFactory,
    };
}
