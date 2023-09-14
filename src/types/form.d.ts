// FORM INPUTS PRE-DEFINED TYPES

declare type PreFormInputsType<T extends string> = {
    [key in T]: PreFormInputPropsType<T>;
};

declare interface PreFormInputPropsType<T extends string> {
    validations?: <U extends FormInputsType<T>>(
        currentInput: string,
        formInputs: U,
    ) => Validation[];
    required?: boolean | string;
    errors?: string[];
    value?: string;
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

declare type FormHandledInputsType<
    T extends string,
    IF extends string | undefined = undefined,
    IO extends string | undefined = undefined,
> = IO extends undefined
    ? { [key in T]: FormHandledInputsProps<T, IF> }
    : { [key in Omit<T, IO>]: FormHandledInputsProps<T, IF> };

declare type FormHandledInputsProps<
    T extends string,
    IF extends string | undefined,
> = IF extends undefined
    ? Omit<PreFormInputPropsType<T>, DefaultFieldsToOmitType>
    : Omit<PreFormInputPropsType<T>, IF>;

declare type DefaultFieldsToOmitType = 'errors' | 'required' | 'validations';

declare type HandleInputsPropsType<T extends string> = {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType<T>;
    handledInputs: FormHandledInputsType<T>;
    onChangeInput: <O extends T, V>({
        objectifiedName,
        targetProp,
        value,
    }: ChangeInputsTypes<O, V>) => void;
    setShowInputsMessage: (value: boolean) => void;
};

declare interface ChangeInputsTypes<O extends T, V> {
    objectifiedName: O;
    targetProp: TargetPropsType;
    value: V;
}

declare type TargetPropsType = 'value' | 'files';

declare interface PreValidateType {
    validations?: (
        currentInput: string,
        inputToCompare?: string,
    ) => Validation[];
    required?: boolean | string;
}

declare interface ValidateType {
    validations?: (
        currentInput: string,
        inputToCompare?: string,
    ) => Validation[];
    required?: boolean | string;
    value: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message?: string;
}
