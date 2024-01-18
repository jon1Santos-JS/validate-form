const advice: { [key: string]: string } = {
    title: 'Welcome to the validate hook test',
    advise: "If the limit to create account reached, you can access the app using the admin's account, and reset the database:",
    account: `[ username: ${process.env.NEXT_PUBLIC_ADMINS_USERNAME} / password: ${process.env.NEXT_PUBLIC_ADMINS_PASSWORD} ]`,
};

export default function Description() {
    return (
        <div className="o-description l-bg--primary">
            <h1 className="title">{advice.title}</h1>
            <div className="advise">
                <h4>{advice.advise}</h4>
            </div>
            <h4 className="account">{advice.account}</h4>
        </div>
    );
}
