import prisma from './prismaClient.js';
import bcrypt from 'bcrypt'
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME, SALT } from './enviroment.js';
(() => {
    const populate = async () => {

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, Number(SALT));
        await prisma.user.upsert({
            where: {email: ADMIN_EMAIL},
            update: {},
            create: {
                email: ADMIN_EMAIL,
                username: ADMIN_USERNAME,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

    }

    populate();
})();