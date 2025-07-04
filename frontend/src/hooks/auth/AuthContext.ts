export type AuthContextType = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => string | undefined;
};

export const AuthContextDefault: AuthContextType = {
  getToken: () => undefined,
  signIn: () => new Promise(() => {}),
  signOut: () => new Promise(() => {}),
};
