import { render, screen, fireEvent } from "@testing-library/react";
import FormHandler from "./Forms";

test("Input mező változásának kezelése", () => {
  render(<FormHandler />);

  const nameInput = screen.getByLabelText(/name/i);

  fireEvent.change(nameInput, { target: { value: "John Doe" } });

  expect(nameInput.value).toBe("John Doe");
});
