import { useRef, useState } from "react";
import "./combobox.css";
import useOnClickOutside from "../../utils/useClickOutside";

type ComboBoxProps = {
  label?: String;
  options: {
    name: String;
    value: String;
  }[];
  selectedValue: String;
  handleChange: Function;
  id: string;
  input: string;
  handleInputChange: Function;
  delayTime?: number;
  placeholder: string;
};

const Combobox = ({
  label,
  options,
  selectedValue,
  handleChange,
  id,
  input,
  delayTime = 1,
  handleInputChange,
  placeholder,
}: ComboBoxProps) => {
  // Manage State for options
  const [filteredOptions, setFilteredOptions] = useState<
    ComboBoxProps["options"] | null
  >(null);

  // Filter options based on text input by the user
  const filterOptions = (input: String) => {
    if (input?.length === 0) return options;
    return options?.filter((option) =>
      option.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Enable Close on Outside Click
  const optionsRef = useRef(null);
  const handleClickOutside = () => {
    setFilteredOptions(null);
  };
  useOnClickOutside(optionsRef, handleClickOutside);

  return (
    <section className="combobox" ref={optionsRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        value={input}
        id={id}
        placeholder={placeholder}
        onFocus={(event) => {
          event.preventDefault();
          if (input?.length === 0) setFilteredOptions(options);
          else setFilteredOptions(filterOptions(input));
        }}
        onChange={(event) => {
          event.preventDefault();
          handleInputChange(event.target.value);
          setTimeout(() => {
            setFilteredOptions(filterOptions(event.target.value));
          }, delayTime);
        }}
      />
      {filteredOptions && (
        <section className="options">
          {filteredOptions?.map(({ name, value }) => (
            <button
              className="option"
              onClick={(e) => {
                e.preventDefault();
                handleInputChange(name);
                handleChange(value);
              }}
            >
              {selectedValue === value && <span>✅</span>} {name}
            </button>
          ))}
        </section>
      )}
    </section>
  );
};

export default Combobox;
