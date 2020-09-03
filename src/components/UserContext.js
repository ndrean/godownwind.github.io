import React, { useState } from "react";

const UserContext = React.createContext([{}, () => {}]);

function UserProvider({ children }) {
  const [userData, setUserData] = useState({});

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
