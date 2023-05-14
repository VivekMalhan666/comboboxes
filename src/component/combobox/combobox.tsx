import { useEffect, useRef, useState } from "react";
import "./combobox.css";
import useOnClickOutside from "../../utils/useClickOutside";

type ComboBoxProps = {
  labelName?: string;
  options: {
    name: string;
    value: string;
  }[];
  delayTime?: number;
  placeholder: string;
  onSelect: (value: string) => void;
};

type OptionSelect = {
  name: string;
  value: string;
};

type UserInput = {
  inputValue: string;
};

const Combobox = ({
  labelName,
  options,
  onSelect,
  delayTime = 1,
  placeholder,
}: ComboBoxProps) => {
  // Manage State for options
  const [filteredOptions, setFilteredOptions] = useState<
    ComboBoxProps["options"] | null
  >(null);
  const [selectedOption, setSelectedOption] = useState<string | null>("");
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  // toggle between button for dropdown and input based on user behaviour
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on text input by the user
  const filterOptions = (input: String) => {
    if (search?.length === 0) return options;
    return options?.filter((option) =>
      option.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Enable Close on Outside Click
  const optionsRef = useRef(null);
  const handleClickOutside = () => {
    setFilteredOptions(null);
    setIsOpen(false);
  };
  useOnClickOutside(optionsRef, handleClickOutside);

  // Handle Remove Selection
  const handleRemoveSelection = () => {
    setSelectedOption("");
    setSearch("");
  };

  // Select an option
  const selectOption = ({ name, value }: OptionSelect) => {
    if (selectedOption === value) {
      handleRemoveSelection();
    } else {
      setSearch(name);
      setSelectedOption(value);
    }
  };

  // Filter options of input
  const userInputAction = ({ inputValue }: UserInput) => {
    setSearch(inputValue);
    setTimeout(() => {
      setFilteredOptions(filterOptions(inputValue));
    }, delayTime);
  };

  return (
    <section
      className="combobox"
      ref={optionsRef}
      role="combobox"
      aria-controls=""
      aria-haspopup="listbox"
      aria-expanded={isOpen ? true : undefined}
    >
      {labelName && <label htmlFor={labelName}>{labelName}</label>}
      <section className="combobox-input-container">
        <input
          className="combobox-input"
          value={search}
          id={labelName}
          placeholder={placeholder}
          ref={searchInputRef}
          onFocus={(event) => {
            event.preventDefault();
            if (search?.length === 0) setFilteredOptions(options);
            else setFilteredOptions(filterOptions(search));
            setIsOpen(true);
          }}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const inputValue = event.target.value;
            userInputAction({ inputValue });
          }}
        />
        <button
          className={`combobox-button ${
            isOpen || search?.length > 0 || selectedOption
              ? "combobox-button-hide"
              : ""
          } `}
          onClick={(event) => {
            event.preventDefault();
            setIsOpen(true);
          }}
          aria-haspopup="listbox"
        >
          {selectedOption || placeholder || `Select ${labelName}`}
        </button>
      </section>
      {isOpen && (
        <ul
          className="combobox-options"
          role="listbox"
          aria-labelledby="combobox-label"
        >
          {filteredOptions?.map(({ name, value }) => (
            <li
              className="option"
              role="option"
              aria-selected={selectedOption === value}
              onClick={(e) => {
                e.preventDefault();
                selectOption({ name, value });
              }}
            >
              {selectedOption === value && <span>✅</span>} {name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Combobox;
