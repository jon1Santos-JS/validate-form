import '@testing-library/jest-dom';
import useValidate from '@/hooks/useValidate';
import '@testing-library/jest-dom';

const inputs: FormInputsType = {
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

test('testing validate hook', async () => {
    const { validateAllInputs, preValidate } = useValidate();
    expect(preValidate('username', inputs)).toBe(undefined);
    expect(preValidate('password', inputs)).toBe(undefined);
    expect(preValidate('confirmPassword', inputs)).toBe(undefined);
    expect(validateAllInputs(inputs)).toBe(undefined);
});
