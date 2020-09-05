import React from "react";

const PositionContext = React.createContext([{}, () => {}]);

function PositionProvider({ children }) {
  const [gps, setGps] = React.useState({});
  return (
    <PositionContext.Provider value={[gps, setGps]}>
      {children}
    </PositionContext.Provider>
  );
}

export { PositionContext, PositionProvider };
