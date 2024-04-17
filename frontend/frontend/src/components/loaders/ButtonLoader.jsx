import React from "react";
import "./buttonLoader.css";
import { ClipLoader } from "react-spinners";
const ButtonLoader = () => {
  return (
    <div className="spinner-border text-warning" role="status">
      <ClipLoader
        color={"white"}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default ButtonLoader;
