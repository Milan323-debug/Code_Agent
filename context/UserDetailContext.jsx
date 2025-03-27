import { createContext } from "react";

export const UserDetailContext = createContext({
  userDetails: {},
  setUserDetails: () => {},
});
