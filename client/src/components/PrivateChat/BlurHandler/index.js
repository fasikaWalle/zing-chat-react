import React, { useRef, useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";

const BlurContext = React.createContext();



export function useVisible() {
    return useContext(BlurContext);
}

function BlurHandler({children}) {
    const [visible, setVisibility] = useState(false)
    function BlurHandlerFunction(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && visible){
              setVisibility(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref, visible]);
    }
    const wrapperRef = useRef(null)
    BlurHandlerFunction(wrapperRef);

    return (
        <BlurContext.Provider value={{visible, setVisibility}}>
            <div ref={wrapperRef}>
                {children}
            </div>
        </BlurContext.Provider>
    )
}
BlurHandler.propTypes = {
    children: PropTypes.element.isRequired
};


export default BlurHandler;
