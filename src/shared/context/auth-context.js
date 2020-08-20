import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  email: null,
  name: null,
  profilePicture: null,
  login: () => {},
  logout: () => {},
}); 