// filepath: d:\Semester\S6\Enterprise\Frontend\Enterprise_Poormans\Frontend\src\RoleContext.js
import React, { createContext, useState } from "react";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("TUTOR"); // Default role

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
