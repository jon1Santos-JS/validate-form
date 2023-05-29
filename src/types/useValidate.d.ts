declare interface ReturnValidationFunctionsType {
    [key: string]: ValidationFunctionType;
}

declare type ValidationFunctionType = (
    currentInputValue?: string,
) => string[] | undefined;
