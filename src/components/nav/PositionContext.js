import React from "react";

//export default React.createContext(null);
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
