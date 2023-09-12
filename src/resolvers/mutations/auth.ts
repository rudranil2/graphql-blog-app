import { Context, SignUpPayload, UserPayloadType } from "../../types";

const authResolvers = {
    signup: async ( _: any, { input } : { input: SignUpPayload }, { prisma }: Context ): Promise<UserPayloadType> => {

        const duplicateUser = await prisma.user.findFirst({
            where: {
                email: input.email,
                deletedAt: null
            }
        });

        if(duplicateUser){
            return {
                userErrors: [{
                    message: `User already exists`
                }],
                user: null
            }
        }

        try{
            const bio = input.bio;
            delete input.bio;
    
            const user = await prisma.user.create({
                data: {
                    ...input,
                    profile: {
                        create: {
                            bio: bio || ''
                        }
                    }
                }
            });
    
            return {
                userErrors: null,
                user
            }

        }catch(e: any){
            return {
                userErrors: [{
                    message: e.message
                }],
                user: null
            }
        }

    }
}

export default authResolvers;