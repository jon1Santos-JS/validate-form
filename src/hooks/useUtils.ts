import { useEffect, useState } from 'react';

export default function useUtils() {
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

    return {
        onSetTimeOut,
        onSetAsyncTimeOut,
    };
}
