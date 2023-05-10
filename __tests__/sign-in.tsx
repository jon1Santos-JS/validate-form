import { MiniDBAccountHandler } from '@/database/accountHandler';
import '@testing-library/jest-dom';

test('check signIn function', async () => {
    const DBAccountHandler = new MiniDBAccountHandler();
    const account = {
        username: { value: 'asd123' },
        password: { value: 'asd123' },
    };
    return await expect(DBAccountHandler.signIn(account)).resolves.toBe(
        `user: ${account.username.value} has been logged`,
    );
});
