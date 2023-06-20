import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignUpModal from './SignUpModal';

export default function SignUpContent() {
    const [signUpResponse, setSignUpResponse] = useState(false); // SHOW MODAL
    return (
        <>
            <SignUpForm
                setResponse={(data: boolean) => setSignUpResponse(data)}
            />
            <SignUpModal
                isModalOpen={() => signUpResponse}
                onCloseModal={() => setSignUpResponse(false)}
            />
        </>
    );
}
