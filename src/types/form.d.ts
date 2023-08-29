// FORM INPUTS PRE-DEFINED TYPES

declare type PreFormInputsType<T extends string> = {
    [key in T]: PreFormInputPropsType<T>;
};

declare interface PreFormInputPropsType<T extends string> {
    validations: <U extends FormInputsType<T>>(
        currentInput: string,
        formInputs: U,
    ) => Validation[];
    required?: boolean | string;
    errors?: string[];
    value?: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}

// *NECESSARY FORM INPUT'S FIELDS TO VALIDATE

declare type FormInputsType<T extends string> = {
    [key in T]: FormInputPropsType<T>;
};

declare interface FormInputPropsType<T extends string>
    extends PreFormInputPropsType<T> {
    errors: string[];
    value: string;
}

declare type FileType = FileList | undefined | null;

// FORM INPUT ATTRIBUTES TO COSTUMIZE

declare type TargetPropsType = 'value' | 'files' | 'accessKey';

declare type FormHandledInputsType<T extends string> = {
    [key in T]: FormHandledInputsPropsType;
};

declare type FormHandledInputsPropsType<T> = {
    [key in TargetPropsType]: T;
};

declare type HandleInputsPropsType<T extends string> = {
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
