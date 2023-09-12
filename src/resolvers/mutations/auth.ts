import { Context, SignUpPayload, AuthPayloadType, UserError, PayloadErrorType } from "../../types";
import validator from 'validator';
import bcypt from 'bcryptjs';

const authResolvers = {
    signup: async ( _: any, { input } : { input: SignUpPayload }, { prisma }: Context ): Promise<AuthPayloadType> => {

        const { email, password } = input;

        const { error, userErrors } = payloadValidation(email,password);
        if(error){
            return {
                user: null,
                userErrors: userErrors
            }
        }

        const duplicateUser = await prisma.user.findFirst({
            where: {
                email: input.email,
                deletedAt: null
            }
        });
        if(duplicateUser){
            return {
                userErrors: [{
                    message: `Cannot use email`
                }],
                user: null
            }
        }

        const bio = input.bio;
        delete input.bio;

        //Hashing password
        input.password = await bcypt.hash( password, 10 );

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
    }
}

function payloadValidation(email: string, password: string){

    const errorObj: PayloadErrorType = {
        error: false,
        userErrors: []
    }

    const isValidEmail  = validator.isEmail(email);
    const isValidPassword = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });
   
    if( !isValidEmail || !isValidPassword) {
        errorObj.error = true;

      !isValidEmail
        ? errorObj.userErrors.push({ message: 'Email is not valid' })
        : null;

      !isValidPassword
        ? errorObj.userErrors.push({
            message:
              'Password needs a mix of lower & upper case letters, numbers and symbol, and must be at least 8 characters long',
          })
        : null;
    }

    return errorObj;
}

export default authResolvers;