import { onOmitProps } from '@/lib/lodashAdapter';
import { useEffect, useState } from 'react';

const API = 'api/checkUsername';

export const FIELDS_TO_OMIT: (
    | 'errors'
    | 'validations'
    | 'asyncValidations'
    | 'required'
    | 'crossfields'
)[] = ['errors', 'asyncValidations', 'validations', 'required', 'crossfields'];

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

    async function onCheckUsername(username: string) {
        const options = { method: 'POST', body: username };
        const response = await fetch(API, options);
        const parsedResponse: ServerResponse = await response.json();
        return parsedResponse.serverResponse;
    }

    function inputsFactory<T extends string, G extends T>({
        asyncValidations,
        validations,
        required,
        crossfields,
        files,
    }: {
        asyncValidations?: AsyncValidateFunctionType<T>;
        validations?: ValidateFunctionType<T>;
        required?: string | boolean;
        crossfields?: G[];
        files?: FileList | null;
    }): ValidateInputType<T> {
        return {
            asyncValidations,
            validations,
            value: '',
            errors: [],
            required,
            crossfields,
            files,
        };
    }

    return {
        omitFields,
        onSetTimeOut,
        inputsFactory,
        onCheckUsername,
    };
}
