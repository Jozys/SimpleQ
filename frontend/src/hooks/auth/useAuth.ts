import React from "react";
import type { AuthContextType } from "./AuthContext";
import { AuthContext } from "./AuthProvider";

export default function useAuth() {
  return React.useContext<AuthContextType>(AuthContext);
}
