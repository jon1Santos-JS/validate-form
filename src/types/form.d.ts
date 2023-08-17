// FORM INPUTS PRE-DEFINED TYPES

declare type PreFormInputsType<T extends string> = {
    [key in T]: PreFormInputPropsType;
};

declare interface PreFormInputPropsType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
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
    [key in T]: FormInputPropsType;
};

declare interface FormInputPropsType extends PreFormInputPropsType {
    errors: string[];
    value?: string;
}

declare type FileType = FileList | undefined | null;

// FORM INPUT'S FIELDS TO SUBMIT

declare type FormInputsTypeToSubmit<T extends string> = {
    [key in T]: FormInputPropsTypeToSubmit;
};

// FORM INPUT ATTRIBUTES TO COSTUMIZE

declare type TargetPropsType = 'value' | 'files' | 'accessKey' | 'clientTop';

declare type FormHandledInputsType<T extends string> = {
    [key in T]: FormHandledInputsPropsType;
};

declare type FormHandledInputsPropsType<T> = {
    [key in TargetPropsType]: T;
};

declare interface FormInputPropsTypeToSubmit {
    files?: FileType;
    value: string;
}
