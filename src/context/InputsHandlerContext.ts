import React from 'react';

export type InputsHandlerContextType<T extends string> = {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType<T>;
    handledInputs: FormHandledInputsType<T>;
    onChangeInput: <R extends T, U>({
        objectifiedName,
        targetProp,
        value,
    }: {
        objectifiedName: R;
        targetProp: TargetPropsType;
        value: U;
    }) => void;
    setShowInputsMessage: (value: boolean) => void;
};

export function createContextTest<T extends string>() {
    return React.createContext<InputsHandlerContextType<T>>({
        showInputMessagesFromOutside: false,
        inputs: {} as FormInputsType<T>,
        handledInputs: {} as FormHandledInputsType<T>,
        onChangeInput: () => undefined,
        setShowInputsMessage: () => undefined,
    });
}

export const InputsHandledContext = createContextTest<any>();
