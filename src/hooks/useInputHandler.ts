import { onOmitProps } from '@/lib/lodashAdapter';
import { useEffect, useState } from 'react';

export const FIELDS_TO_OMIT: (keyof ValidateInputType<string>)[] = [
    'errors',
    'validations',
    'required',
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

    function onHighlightManyInputs<T extends string>(
        inputs: { [key in T]: InputState<T> },
        value: boolean,
        highLightLevel: 1 | 2 | 3,
    ) {
        if (highLightLevel === 1) {
            for (const i in inputs) {
                const typedIndex = i as T;
                inputs[typedIndex].onShowInputMessage(value, typedIndex);
            }
            return;
        }
        if (highLightLevel === 2) {
            for (const i in inputs) {
                const typedIndex = i as T;
                inputs[typedIndex].onHighlightInput(value, typedIndex);
            }
            return;
        }
        if (highLightLevel === 3) {
            for (const i in inputs) {
                const typedIndex = i as T;
                inputs[typedIndex].onShowInputMessage(value, typedIndex);
                inputs[typedIndex].onHighlightInput(value, typedIndex);
            }
            return;
        }
    }

    return {
        omitFields,
        onHighlightManyInputs,
        onSetTimeOut,
    };
}
