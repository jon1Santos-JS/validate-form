import { MiniDBAccountHandler } from '@/database/accountHandler';

test('check signUp function', async () => {
    const DBAccountHandler = new MiniDBAccountHandler();
    for (let i = 0; i < 10; i++) {
        const account = {
            username: { value: randomString() },
            password: { value: randomString() },
        };
        await expect(DBAccountHandler.signUp(account)).resolves.toBe(
            'internal server error',
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

randomCharacter(97, 123);
