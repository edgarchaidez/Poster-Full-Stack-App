import { useState, useCallback, useEffect } from "react";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [profilePicture, setProfilePicture] = useState();

  const login = useCallback(
    (uId, token, existingExpirationDate, email, name, image) => {
      setToken(token);
      setUserId(uId);
      setEmail(email);
      setName(name);
      setProfilePicture(image);

      const tokenExpirationDate =
        existingExpirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationTime(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uId,
          token,
          expirationTime: tokenExpirationDate.toISOString(),
          name: name,
          email: email,
          image: image,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setEmail(null);
    setName(null);
    setProfilePicture(null);

    setTokenExpirationTime(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationTime) {
      const timeToExpiration =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, timeToExpiration);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expirationTime) > new Date()
    )
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expirationTime),
        storedData.email,
        storedData.name,
        storedData.image
      );
  }, [login]);

  return { login, logout, token, userId, email, name, profilePicture };
};
