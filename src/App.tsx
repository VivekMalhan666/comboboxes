import { useState } from "react";
import "./App.css";
import Combobox from "./component/combobox/combobox";

function App() {
  const [userSelection, setUserSelection] = useState<string | null>(null);
  const options = [
    { name: "Albertsons" },
    { name: "BJs" },
    { name: "Marriott" },
    { name: "Verizon" },
    { name: "ASO" },
    { name: "GenesisX", subcontent: "Innersource" },
    { name: "TCP" },
    { name: "Manscaped" },
  ];
  console.log(userSelection);
  return (
    <Combobox
      options={options}
      onChange={setUserSelection}
      selectionKey="name"
      uniqueKey="name"
    />
  );
}

export default App;
