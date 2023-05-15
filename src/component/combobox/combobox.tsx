import { ReactElement, useEffect, useRef, useState } from "react";
import "./combobox.css";
import useOnClickOutside from "../../utils/useClickOutside";
import DropDownIcon from "../Icons/DropDownIcon";
import TickIcon from "../Icons/TickIcon";

type ComboBoxProps = {
  options: Object[] | string[];
  labelName?: string;
  delayTime?: number;
  placeholder?: string;
  onChange: (value: string | null) => void;
  isSelectedIconOnLeft?: Boolean;
  renderOption?: (option: Object | string) => React.ReactNode;
  selectionKey: string | keyof Object;
  uniqueKey: string;
  value?: string;
  IconForDropDown?: ReactElement | string;
  className?: string;
};

type UserInput = {
  inputValue: string;
};

const Combobox = ({
  labelName,
  options,
  onChange,
  delayTime = 1,
  placeholder,
  isSelectedIconOnLeft,
  IconForDropDown,
  selectionKey,
  uniqueKey,
  value = "",
  className,
}: ComboBoxProps) => {
  // Manage State for options
  const [filteredOptions, setFilteredOptions] = useState<
    ComboBoxProps["options"] | null
  >(null);
  const [selectedOption, setSelectedOption] = useState<
    string | null | undefined | Array<string>
  >(value);
  const [search, setSearch] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  // toggle between button for dropdown and input based on user behaviour
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  // Filter options based on text input by the user
  const filterOptions = (search: String | null) => {
    if (!search || search?.length === 0) return options;
    return options?.filter((option) => {
      return (option as any)[selectionKey]
        .toLowerCase()
        .includes(search.toLowerCase());
    });
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
    setSelectedOption(null);
    setSearch("");
    onChange(null);
  };

  // Select an option
  const handleOptionSelect = (option: string) => {
    if (selectedOption === option) {
      handleRemoveSelection();
    } else {
      setSearch(option);
      setIsOpen(false);
      setSelectedOption(option);
      onChange(option);
    }
  };

  // Filter options of input
  const userInputAction = ({ inputValue }: UserInput) => {
    setSearch(inputValue);
    setTimeout(() => {
      setFilteredOptions(filterOptions(inputValue));
    }, delayTime);
    setSelectedOption(null);
  };

  // Keyboard accessibility
  const activeOptionRef = useRef<HTMLLIElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      (listboxRef.current?.firstChild as HTMLElement).focus();
      activeOptionRef.current = listboxRef.current?.firstChild as HTMLLIElement;
    }
  };

  const handleListboxKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    name: string
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextOption = activeOptionRef.current?.nextSibling as Element | null;
      if (nextOption) {
        activeOptionRef.current?.setAttribute("aria-selected", "false");
        activeOptionRef.current = nextOption as HTMLLIElement;
        activeOptionRef.current?.setAttribute("aria-selected", "true");
        (activeOptionRef.current as HTMLElement)?.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevOption = activeOptionRef.current
        ?.previousSibling as Element | null;
      if (prevOption) {
        activeOptionRef.current?.setAttribute("aria-selected", "false");
        activeOptionRef.current = prevOption as HTMLLIElement;
        activeOptionRef.current?.setAttribute("aria-selected", "true");
        (activeOptionRef.current as HTMLElement)?.focus();
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      const firstOption = listboxRef.current?.firstChild as HTMLElement;
      if (firstOption) {
        firstOption.focus();
      }
    } else if (event.key === "End") {
      event.preventDefault();
      const lastOption = listboxRef.current?.lastChild as HTMLElement;
      if (lastOption) {
        lastOption.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSearch("");
      setIsOpen(false);
      setSelectedOption("");
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (event.key === "Enter" && selectedOption !== null) {
      event.preventDefault();
      if (name) handleOptionSelect(name);
    }
  };

  return (
    <section
      className={`combobox ${className || ""}`}
      ref={optionsRef}
      role="combobox"
      aria-controls=""
      aria-haspopup="listbox"
      aria-expanded={isOpen ? true : undefined}
    >
      {labelName && (
        <label className="combobox-label" htmlFor={labelName}>
          {labelName}
        </label>
      )}
      <section className="combobox-input-container">
        <input
          className="combobox-input"
          value={search || value}
          id={labelName}
          placeholder={placeholder}
          ref={searchInputRef}
          onKeyDown={handleInputKeyDown}
          onFocus={(event) => {
            event.preventDefault();
            if (search && search?.length === 0) setFilteredOptions(options);
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
            isOpen || (search && search?.length > 0) || selectedOption
              ? "combobox-button-hide"
              : ""
          } `}
          onClick={(event) => {
            event.preventDefault();
            setIsOpen(true);
          }}
          aria-haspopup="listbox"
          tabIndex={-1}
        >
          {selectedOption || placeholder || `Select ${labelName}`}
        </button>
        <button
          className="combobox-button-icon"
          onClick={(event) => {
            event.preventDefault();
            setIsOpen(!isOpen);
          }}
          aria-haspopup="listbox"
          tabIndex={-1}
        >
          {IconForDropDown || <DropDownIcon />}
        </button>
      </section>
      {isOpen && (
        <ul
          className="combobox-options"
          role="listbox"
          aria-labelledby="combobox-label"
          ref={listboxRef}
          tabIndex={-1}
        >
          {filteredOptions?.map((option) => (
            <li
              className={`comobox-option ${
                selectedOption === (option as any)[uniqueKey]
                  ? "combobox-option-selected"
                  : ""
              }
                ${
                  selectedOption === (option as any)[uniqueKey] &&
                  isSelectedIconOnLeft
                    ? "combobox-option-selected-left"
                    : ""
                }`}
              role="option"
              tabIndex={0}
              key={(option as any)[uniqueKey]}
              ref={
                selectedOption === (option as any)[uniqueKey]
                  ? activeOptionRef
                  : undefined
              }
              aria-selected={selectedOption === (option as any)[uniqueKey]}
              onClick={(e) => {
                e.preventDefault();
                handleOptionSelect((option as any)[uniqueKey]);
              }}
              onKeyDown={(e) =>
                handleListboxKeyDown(e, (option as any)[uniqueKey])
              }
            >
              {selectedOption === (option as any)[uniqueKey] && (
                <TickIcon
                  className={`${
                    selectedOption === (option as any)[uniqueKey] &&
                    isSelectedIconOnLeft
                      ? "combobox-option-selected-left-icon"
                      : "combobox-option-selected-icon"
                  }`}
                />
              )}
              {(option as any)[uniqueKey]}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Combobox;
