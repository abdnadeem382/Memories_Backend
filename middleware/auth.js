import jwt from 'jsonwebtoken';

const auth = async (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; //length will be > 500 for a google token

        let decodedData;

        if(token && isCustomAuth){ //if it's our own token
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id
        }
        else{ //if it's google's token
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

export default auth;