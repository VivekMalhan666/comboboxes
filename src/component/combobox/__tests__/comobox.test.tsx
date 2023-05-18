import { render, screen, fireEvent } from "@testing-library/react";
import Combobox from "../combobox";

test("renders Combobox without errors", () => {
  render(
    <Combobox options={[]} onChange={() => {}} selectionKey="" uniqueKey="" />
  );
});

test("renders label correctly", () => {
  const { getByLabelText } = render(
    <Combobox
      options={[]}
      onChange={() => {}}
      selectionKey=""
      uniqueKey=""
      labelName="My Combobox"
    />
  );

  expect(screen.getByLabelText("My Combobox")).toBeInTheDocument();
});

test("renders input placeholder correctly", () => {
  const { getByPlaceholderText } = render(
    <Combobox
      options={[]}
      onChange={() => {}}
      selectionKey=""
      uniqueKey=""
      placeholder="Select an option"
    />
  );

  expect(screen.getByPlaceholderText("Select an option")).toBeInTheDocument();
});

test("displays options list when input is focused", () => {
  const { getByPlaceholderText, getByRole } = render(
    <Combobox
      options={["Option 1", "Option 2"]}
      onChange={() => {}}
      selectionKey=""
      uniqueKey=""
    />
  );

  const input = screen.getByPlaceholderText("Choose an option");
  fireEvent.focus(input);

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("calls onChange callback with selected value", () => {
  const handleChange = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <Combobox
      options={["Option 1", "Option 2"]}
      onChange={handleChange}
      selectionKey=""
      uniqueKey=""
    />
  );

  const input = screen.getByPlaceholderText("Choose an option");
  fireEvent.focus(input);

  const option = screen.getByText("Option 1");
  fireEvent.click(option);

  expect(handleChange).toHaveBeenCalledWith("Option 1");
});

it("should change the selected value when an option is clicked", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const onChange = jest.fn();
  const { getByRole, getByText } = render(
    <Combobox
      options={options}
      onChange={onChange}
      selectionKey={"label"}
      uniqueKey={"value"}
    />
  );

  // Open the dropdown
  fireEvent.click(screen.getByText("Choose an option"));

  // Select the second option
  const option2 = screen.getByText("Option 2");
  fireEvent.click(option2);

  // Verify that the selected value has changed
  expect(onChange).toHaveBeenCalledWith("Option 2");
  expect(screen.getByRole("textbox")).toHaveValue("Option 2");
});
