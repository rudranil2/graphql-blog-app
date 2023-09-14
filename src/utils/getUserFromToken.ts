import jwt from 'jsonwebtoken';

const getCurrentUser = (token: string) => {
    try{
        return jwt.verify(token, process.env.JWT_PRIVATE_KEY as string);
    }catch(e){         
        return null;
    }
}


export default getCurrentUser;