// jwtUtils.js
import {
    jwtDecode
} from 'jwt-decode';

export const decodeToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.user;
    } catch (error) {
        return null;
    }
};