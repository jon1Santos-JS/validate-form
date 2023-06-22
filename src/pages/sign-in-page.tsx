import SignInForm from '@/components/SignInForm';

type SignInPageProps = HandlerUserStateProps;

export default function SignInPage(userprops: SignInPageProps) {
    return (
        <div>
            <SignInForm {...userprops} />
        </div>
    );
}
