import { ReactElement, useEffect, useRef, useState } from "react";
import "./combobox.css";
import useOnClickOutside from "../../utils/useClickOutside";
import DropDownIcon from "../Icons/DropDownIcon";
import TickIcon from "../Icons/TickIcon";

type Option = Object | string;

type ComboBoxProps = {
  options: Option[];
  labelName?: string;
  delayTime?: number;
  placeholder?: string;
  onChange: (value: string | null) => void;
  isSelectedIconOnLeft?: boolean;
  renderOption?: (option: Option) => React.ReactNode;
  selectionKey: string | keyof Option;
  uniqueKey: string;
  value?: string | string[];
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
  const [filteredOptions, setFilteredOptions] = useState<Option[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    string | null | undefined | string[]
  >(value);
  const [search, setSearch] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLLIElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  useEffect(() => {
    if (selectedOption === null) {
      setSearch("");
    }
  }, [selectedOption]);

  const filterOptions = (search: string | null) => {
    if (!search || search.length === 0) {
      return options;
    }
    return options?.filter((option) => {
      const optionValue =
        typeof option === "object" ? (option as any)[selectionKey] : option;
      return optionValue.toLowerCase().includes(search.toLowerCase());
    });
  };

  const handleClickOutside = () => {
    setFilteredOptions(null);
    setIsOpen(false);
  };

  useOnClickOutside(optionsRef, handleClickOutside);

  const handleRemoveSelection = () => {
    setSelectedOption(null);
    setSearch("");
    onChange(null);
  };

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

  const userInputAction = ({ inputValue }: UserInput) => {
    setSearch(inputValue);
    setTimeout(() => {
      setFilteredOptions(filterOptions(inputValue));
    }, delayTime);
    setSelectedOption(null);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      activeOptionRef.current = listboxRef.current
        ?.firstElementChild as HTMLLIElement;
      activeOptionRef.current?.focus();
    }
  };

  const handleListboxKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    selectedOption: string
  ) => {
    const key = event.key;
    const activeOption = activeOptionRef.current;
    const firstOption = listboxRef.current?.firstElementChild as HTMLLIElement;
    const lastOption = listboxRef.current?.lastElementChild as HTMLLIElement;

    if (key === "ArrowDown") {
      event.preventDefault();
      if (activeOption !== lastOption) {
        activeOptionRef.current =
          activeOption?.nextElementSibling as HTMLLIElement;
        activeOptionRef.current?.focus();
      }
    } else if (key === "ArrowUp") {
      event.preventDefault();
      if (activeOption !== firstOption) {
        activeOptionRef.current =
          activeOption?.previousElementSibling as HTMLLIElement;
        activeOptionRef.current?.focus();
      }
    } else if (key === "Home") {
      event.preventDefault();
      firstOption?.focus();
    } else if (key === "End") {
      event.preventDefault();
      lastOption?.focus();
    } else if (key === "Escape") {
      event.preventDefault();
      handleRemoveSelection();
    } else if (key === "Enter" && selectedOption !== null) {
      event.preventDefault();
      handleOptionSelect(selectedOption);
    }
  };
  const renderOption = (option: any) => {
    // Custom rendering logic based on the option data
    // Return the React element representing the option
    return <span>{option}</span>;
  };

  const renderOptionItem = (option: any, index: number) => {
    const optionLabel =
      typeof option === "object" ? (option as any)[selectionKey] : option;
    const optionKey =
      typeof option === "object" ? (option as any)[uniqueKey] : index;
    const isSelected =
      optionLabel === selectedOption ||
      (Array.isArray(selectedOption) && selectedOption.includes(optionLabel));

    return (
      <li
        key={optionKey}
        className={`combobox-option ${
          isSelected ? "combobox-option-selected" : ""
        }`}
        id={`option-${optionKey}`}
        role="option"
        aria-selected={isSelected ? true : undefined}
        onClick={() => handleOptionSelect(optionLabel)}
        onKeyDown={(e) => handleListboxKeyDown(e, optionLabel)}
        tabIndex={0}
        ref={isSelected ? activeOptionRef : null}
      >
        {isSelected && (
          <TickIcon
            className={`${
              isSelected && isSelectedIconOnLeft
                ? "combobox-option-selected-left-icon"
                : "combobox-option-selected-icon"
            }`}
          />
        )}
        {typeof option === "object" && renderOption
          ? renderOption(optionLabel)
          : option}
      </li>
    );
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
          placeholder={
            placeholder ||
            (labelName && `Select ${labelName}`) ||
            "Choose an option"
          }
          ref={searchInputRef}
          onKeyDown={handleInputKeyDown}
          onFocus={() => {
            if (search && search.length === 0) {
              setFilteredOptions(options);
            } else {
              setFilteredOptions(filterOptions(search));
            }
            setIsOpen(true);
          }}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            userInputAction({ inputValue });
          }}
        />
        <button
          className={`combobox-button ${
            isOpen || search || selectedOption ? "combobox-button-hide" : ""
          }`}
          onClick={() => setIsOpen(true)}
          aria-haspopup="listbox"
          tabIndex={-1}
        >
          {selectedOption ||
            placeholder ||
            (labelName && `Select ${labelName}`) ||
            "Choose an option"}
        </button>
        <button
          className="combobox-button-icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          tabIndex={-1}
        >
          {IconForDropDown || <DropDownIcon />}
        </button>
      </section>
      {isOpen && (
        <ul
          className="combobox-options"
          id={`${labelName}-listbox`}
          role="listbox"
          tabIndex={-1}
          ref={listboxRef}
        >
          {filteredOptions?.map((option, index) =>
            renderOptionItem(option, index)
          )}
        </ul>
      )}
    </section>
  );
};

export default Combobox;
