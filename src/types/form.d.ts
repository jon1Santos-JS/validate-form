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
    ) => Validation<T>[];
    errors: string[];
    value: string;
    files?: FileList | null;
    required?: string | boolean;
}

declare interface Validation<T extends string> {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
    crossfield?: T;
}

declare type InputState<T extends string> = {
    showInputMessage: boolean;
    highlightInput: boolean;
    onShowInputMessage: (value: boolean, key: T) => void;
    onHighlightInput: (value: boolean, key: T) => void;
};
