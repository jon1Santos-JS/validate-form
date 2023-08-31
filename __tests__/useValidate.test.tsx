import useValidate from '@/hooks/useValidate';
import '@testing-library/jest-dom';
import { useEffect } from 'react';
import { act, render } from '@testing-library/react';

interface CustomComponentWrapperPropsType<T extends string> {
    inputs?: FormInputsType<T>;
    fieldName?: T;
    setIsolatedResult?: (newValue: string[]) => void;
    setResult?: (newValue: boolean) => void;
}

type InputsType = 'username' | 'password' | 'confirmPassword';

const inputs: FormInputsType<InputsType> = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ],
        errors: [],
        required: true,
        value: 'asd123',
    },
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ],
        errors: [],
        required: true,
        value: 'asd123',
    },
    confirmPassword: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        errors: [],
        required: true,
        value: 'asd123',
    },
};

test('testing preValidate function from the useValidate hook', async () => {
    let isolatedResult: string[] = [];
    act(() => {
        render(
            <CustomComponentWrapper
                inputs={inputs}
                fieldName={'username'}
                setIsolatedResult={(newValue) => (isolatedResult = newValue)}
            />,
        );
        render(
            <CustomComponentWrapper
                inputs={inputs}
                fieldName={'password'}
                setIsolatedResult={(newValue) => (isolatedResult = newValue)}
            />,
        );
        render(
            <CustomComponentWrapper
                inputs={inputs}
                fieldName={'confirmPassword'}
                setIsolatedResult={(newValue) => (isolatedResult = newValue)}
            />,
        );
    });
    expect(isolatedResult).toStrictEqual([]);
});

test('testing validateAllInputs function from the useValidate hook', async () => {
    let result = false;

    act(() => {
        render(
            <CustomComponentWrapper
                inputs={inputs}
                setResult={(newValue) => (result = newValue)}
            />,
        );
    });
    expect(result).toBe(false);
});

function CustomComponentWrapper<T extends string>({
    inputs,
    fieldName,
    setResult,
    setIsolatedResult,
}: CustomComponentWrapperPropsType<T>) {
    const { validateAllInputs, preValidate } = useValidate();

    useEffect(() => {
        if (fieldName && inputs && setIsolatedResult)
            setIsolatedResult(preValidate(fieldName, inputs));
        if (inputs && setResult) setResult(validateAllInputs(inputs));
    }, [
        fieldName,
        inputs,
        preValidate,
        setIsolatedResult,
        setResult,
        validateAllInputs,
    ]);

    return null;
}
