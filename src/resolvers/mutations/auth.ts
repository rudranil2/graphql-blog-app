import { Context, SignUpPayload, AuthPayloadType, PayloadErrorType, SignInPayload, JWTPayload } from "../../types";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";

const authResolvers = {
    signup: async ( _: any, { input } : { input: SignUpPayload }, { prisma }: Context ): Promise<AuthPayloadType> => {

        const { email, password } = input;

        const { error, userErrors } = payloadValidation(email,password);
        if(error){
            return {
                userErrors: userErrors,
                token: null
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
                token: null
            }
        }

        const bio = input.bio;
        delete input.bio;

        //Hashing password
        input.password = await bcrypt.hash( password, 10 );

        const user = await prisma.user.create({
            data: {
                ...input,
                profile: {
                    create: {
                        bio: bio || 'My Bio'
                    }
                }
            }
        });

        return {
            userErrors: null,
            token: generateToken({
                id: user.id,
                email: user.email
            })
        }
    },
    signin: async ( _: any, { input } : { input: SignInPayload }, { prisma  }: Context ): Promise<AuthPayloadType> => {

        const user = await prisma.user.findFirst({
            where: {
                deletedAt: null,
                email: input.email
            }
        });

        if(!user)
            return {
                userErrors: [{
                    message: `Invalid Credentials`
                }],
                token: null
            };

        const isPasswordMatch = await bcrypt.compare( input.password, user.password);
        if(!isPasswordMatch)
            return {
                userErrors: [{
                    message: `Invalid Credentials`
                }],
                token: null
            };

        return {
            userErrors: null,
            token: generateToken({
                id: user.id,
                email: user.email,
            })
        };
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

function generateToken(payload: Pick<User, 'id' | 'email'>): string{

    const jwtPayload: JWTPayload = {
        sub: payload.id,
        email: payload.email
    }

    const token = jwt.sign(
        jwtPayload, 
        process.env.JWT_PRIVATE_KEY as string, 
        {
            expiresIn: 60 * 10 * 3          // 30 mins
        }
    );

    return token;
}

export default authResolvers;