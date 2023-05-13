import { useState } from "react";
import "./App.css";
import Combobox from "./component/combobox/combobox";

function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [input, setInput] = useState("");
  const options = [
    { name: "Albertsons", value: "albertsons" },
    { name: "TCP", value: "tcp" },
    { name: "Manscaped", value: "manscaped" },
  ];
  return (
    <Combobox
      label="name"
      id="location"
      options={options}
      input={input}
      handleInputChange={setInput}
      selectedValue={selectedOption}
      handleChange={setSelectedOption}
      delayTime={5}
      placeholder="Choose a Name"
    />
  );
}

export default App;
