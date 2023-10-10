declare type HandledInputsType<T extends string> = {
    [key in T]: Partial<ValidateInputType<T>>;
};

declare type InputsToValidateType<T extends string> = {
    [key in T]: ValidateInputType<T>;
};

declare interface ValidateInputType<T extends string> {
    validations?: (
        currentInputValue: string,
        conditionalInputValue?: InputsToValidateType<T>,
    ) => Validation[];
    errors: string[];
    value: string;
    cleanErrors?: boolean;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}

declare type InputState = {
    isControlledFromOutside: boolean;
    showInputMessage: boolean;
    highlightInput: boolean;
    justHighlight?: boolean;
    onShowInputMessage: (value: boolean) => void;
    onHighlightInput: (value: boolean) => void;
    setControlledFromOutside: (value: boolean) => void;
};
