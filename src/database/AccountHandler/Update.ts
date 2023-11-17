import { DATABASE } from '../DBHandler/DBState';

export default class UserUpdateHandler {
    async updateUsername(userAccount: UserWithNewUsername) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, username: userAccount.newUsername }
                : DBAccount,
        );
        console.log(
            `user: ${userAccount.username.value} has been changed to ${userAccount.newUsername.value}`,
        );
        return {
            success: true,
            data: 'Username has been changed',
        } as DBDefaultResponse;
    }

    async updatePassword(userAccount: UserWithNewPassword) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value &&
            DBAccount.password.value === userAccount.password.value
                ? {
                      ...DBAccount,
                      password: userAccount.newPassword,
                  }
                : DBAccount,
        );

        console.log('User password has been changed');
        return {
            success: true,
            data: 'User password has been changed',
        } as DBDefaultResponse;
    }

    async updateUserImage(
        userAccount: UserFromClient,
        newUserImage: NewUserImage,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, userImage: newUserImage.value }
                : DBAccount,
        );

        console.log('User image has been changed');
        return {
            success: true,
            data: newUserImage,
        } as DBUpdateUserImageResponse;
    }
}
