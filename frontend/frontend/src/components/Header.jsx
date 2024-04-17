import React, { useEffect, useState } from "react";
import "./header.css";
import { getTemperature } from "../utils/apiCalls";
import { urls } from "../constants/urls";

const Header = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoader(true);
    getTemperature()
      .then((data) => {
        setLoader(false);
        setData(data);
        console.log(data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="h3">
      <div className="h3 b">
        {loader ? "loading" : `${data?.data?.current?.temp_c} °C`}
        <img src={data?.data?.current?.condition?.icon} alt="icon" />
      </div>
      <div className="h3">
        <img src={urls.location} className="location" alt="location" />
        {loader
          ? "loading"
          : `${data?.data?.location?.name}, ${data?.data?.location?.region}, ${data?.data?.location?.country}`}
      </div>
    </div>
  );
};

export default Header;
