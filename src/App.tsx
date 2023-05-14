import { useState } from "react";
import "./App.css";
import Combobox from "./component/combobox/combobox";

function App() {
  const [userSelection, setUserSelection] = useState<string>("");
  const options = [
    { name: "Albertsons", value: "albertsons" },
    { name: "TCP", value: "tcp" },
    { name: "Manscaped", value: "manscaped" },
  ];
  console.log(userSelection);
  return (
    <Combobox
      labelName="name"
      options={options}
      onSelect={setUserSelection}
      delayTime={5}
      placeholder="Choose a Name"
    />
  );
}

export default App;
