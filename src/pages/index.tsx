import Form from '@/components/Form';
import Input from '@/components/Input';
import useValidate from '@/hooks/useValidate';

export default function Home() {
    const { validateUsername, validatePassword, validate } = useValidate();

    return (
        <>
            <div className="o-app">
                <div className="c-container">
                    <Form validate={validate}>
                        <Input
                            label="Username"
                            typeInput="text"
                            validation={validateUsername}
                        />
                        <Input
                            label="Password"
                            typeInput="password"
                            validation={validatePassword}
                        />
                    </Form>
                </div>
            </div>
        </>
    );
}
