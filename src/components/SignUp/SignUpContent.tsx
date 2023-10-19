import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignUpModal from './SignUpModal';

export default function SignUpContent() {
    const [modalState, setModalState] = useState(false); // SHOW MODAL
    return (
        <>
            <SignUpForm
                ownProps={{
                    setModalState,
                }}
            />
            <SignUpModal
                isModalOpen={modalState}
                onCloseModal={() => setModalState(false)}
            />
        </>
    );
}
