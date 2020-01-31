import React, { useState, useEffect } from "react";
import axios from "axios";

const TowerList1 = () => {
  const [data, setData] = useState();

  const getData = async () => {
    try {
      const res = await axios.get("/get-data");
      console.log(res.data);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data]);

  return (
    <ul>
      {data ? (
        data.map(tower => (
          <li key={tower.number}>
            <div>
              {tower.number}
              {tower.city}
              {tower.state}
            </div>
          </li>
        ))
      ) : (
        <div></div>
      )}
    </ul>
  );
};

export default TowerList1;
