import { Directus } from '@directus/sdk';



export const directus = new Directus("https://kcwe8gkm.directus.app",{
    auth: {
        mode: "json"
    }
});

export const authServce = {
    async login(email: string, password: string) {
        return await directus.auth.login({email, password});
    },
    async register(firstName: string, email: string, password: string): Promise<boolean> {
        const createUser = await directus.users.createOne({
            first_name: firstName,
            email,
            password,
            role: "7af94c9f-5fcd-4c64-aad6-b747bbcdb558"
        });
        
        return !!createUser?.email;

    },
    async logout() {
        return await directus.auth.logout();
    },
    async currentUser() {
        return await directus.users.me.read({
            fields: ['email', 'firstName']
        });
    }
};