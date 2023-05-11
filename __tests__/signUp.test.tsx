import { MiniDBAccountHandler } from '@/database/accountHandler';

const AMOUNT_OF_ACCOUNTS = 6;

test('check signUp function', async () => {
    const DBAccountHandler = new MiniDBAccountHandler();
    try {
        for (let i = 1; i <= AMOUNT_OF_ACCOUNTS; i++) {
            const account = {
                username: { value: randomString() },
                password: { value: randomString() },
            };
            await expect(DBAccountHandler.signUp(account)).resolves.toBe(
                'account has been created',
            );
        }
    } catch {
        const account = {
            username: { value: randomString() },
            password: { value: randomString() },
        };
        await expect(DBAccountHandler.signUp(account)).resolves.toBe(
            'limit DB accounts reached',
        );
    }
});

function randomCharacter(min: number, max: number) {
    const code = Math.floor(Math.random() * (max - min) + min);
    return String.fromCharCode(code);
}

function randomString() {
    const stringArray = [];
    for (let i = 1; i <= 6; i++) {
        stringArray.push(randomCharacter(97, 123));
    }

    return stringArray.join('');
}
