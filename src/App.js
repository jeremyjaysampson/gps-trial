import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import NearestTower from "./Components/NearestTower.js";
import TowerList1 from "./Components/TowerList1.js";
import Upload from "./Components/Upload.js";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <NearestTower />;
//       </header>
//     </div>
//   );
// }

// export default App;

// console.log("hello from app.js");

function View(props) {
  const { screen, setScreen } = props;

  const deleteCookie = async () => {
    try {
      await axios.get("/clear-cookie");
      setScreen("auth");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <p>{screen}</p>
      <TowerList1 />
      <button onClick={deleteCookie}>Logout</button>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("auth");
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const auth = async () => {
    try {
      const res = await axios.get("/authenticate", {
        auth: { username, password }
      });
      console.log(res);

      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const readCookie = async () => {
    try {
      const res = await axios.get("/read-cookie");

      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
      }
    } catch (e) {
      setScreen("auth");
      console.log(e);
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className="App">
      {screen === "auth" ? (
        <div>
          <label>Username: </label>
          <br />
          <input type="text" onChange={e => setUsername(e.target.value)} />
          <br />
          <label>Password: </label>
          <br />
          <input type="password" onChange={e => setPassword(e.target.value)} />
          <br />
          <button type="button" onClick={auth}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <View screen={screen} setScreen={setScreen} />
          <Upload />
        </div>
      )}
    </div>
  );
}

export default App;
