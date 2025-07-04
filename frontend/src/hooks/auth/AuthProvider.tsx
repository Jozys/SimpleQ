import Keycloak from "keycloak-js";
import React, { createContext, useState } from "react";
import { AuthContextDefault, type AuthContextType } from "./AuthContext";

export const AuthContext = createContext<AuthContextType>(AuthContextDefault);

const keycloak = new Keycloak({
  url: import.meta.env.VITE_APP_KC_URL ?? "https://iam.teckdigital.de",
  realm: import.meta.env.VITE_APP_KC_REALM ?? "default",
  clientId: import.meta.env.VITE_APP_KC_CLIENT_ID ?? "default",
});

export default function AuthProvider(props: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const [token, setToken] = useState<string>();

  const getToken = () => {
    return token;
  };

  /**
   * Tries to use existing kc session to login a user or creates a login flow and login the user
   */
  const signIn = async () => {
    if (token || keycloak?.authenticated) return;
    console.log(window.location.href);
    const loginUrl = await keycloak.createLoginUrl({
      redirectUri: window.location.href.split("#")[0],
    });
    window.location.replace(loginUrl);
    global.axios.defaults.headers.common["Authorization"] =
      "Bearer " + keycloak?.token;
    return;
  };

  const checkAuthentication = async () => {
    try {
      let authenticated = keycloak?.didInitialize
        ? keycloak?.authenticated
        : await keycloak.init({
            adapter: "default",
            onLoad: "check-sso",
            checkLoginIframe: false,
            redirectUri: window.location.href.split("#")[0],
          });
      if (authenticated) {
        setToken(keycloak?.token);
        global.axios.defaults.headers.common["Authorization"] =
          "Bearer " + keycloak?.token;
        global.axios.defaults.withCredentials = true;
      } else {
      }
    } catch (error) {
      console.error("Failed to initialize adapter:", error);
    }
  };

  const signOut = async () => {
    console.log("signing out");
    try {
      const logoutUrl = keycloak.createLogoutUrl({
        redirectUri: window.location.href,
        logoutMethod: "GET",
      });
      setToken(undefined);
      window.location.replace(logoutUrl);
      return;
    } catch (error) {
      setToken(undefined);
    }
  };

  React.useEffect(() => {
    if (!token) checkAuthentication();
    else {
      global.axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    return () => {
      setToken(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ getToken: getToken, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
