import { render, screen } from "@testing-library/react";
import Index from ".";

test("shows the children when the checkbox is checked", () => {
  const testMessage = "Welcome to Remix";
  render(<Index />);

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
