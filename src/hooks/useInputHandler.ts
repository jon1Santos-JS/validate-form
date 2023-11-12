import { useEffect, useState } from 'react';

const API = 'api/checkUsername';

export default function useInputHandler() {
    const [timeoutToClear, onSetTimeoutToClear] =
        useState<NodeJS.Timeout | null>(null);
    const [asyncTimeoutToClear, setAsyncTimeoutToClear] =
        useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!timeoutToClear) return;
        return () => clearTimeout(timeoutToClear);
    }, [timeoutToClear]);

    useEffect(() => {
        if (!asyncTimeoutToClear) return;
        return () => clearTimeout(asyncTimeoutToClear);
    }, [asyncTimeoutToClear]);

    async function onSetTimeOut(cb: () => void, timer: number) {
        const timeOut = setTimeout(() => {
            cb();
        }, timer);
        onSetTimeoutToClear(timeOut);
    }

    async function onSetAsyncTimeOut(cb: () => Promise<void>, timer: number) {
        const timeOut = setTimeout(async () => {
            await cb();
        }, timer);
        setAsyncTimeoutToClear(timeOut);
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
        attributes,
    }: ValidateInputType<T, G>) {
        return {
            asyncValidations,
            validations,
            attributes,
            errors: [],
            required,
            crossfields,
        };
    }

    return {
        onSetTimeOut,
        onSetAsyncTimeOut,
        inputsFactory,
        onCheckUsername,
    };
}
