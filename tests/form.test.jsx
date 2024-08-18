import React from "react";
import { it, expect, describe } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Form from "../client/src/Form";

describe("Form", () => {
  it("should render form with input field and submit button", () => {
    render(<Form />);
    const inputElement = screen.getByTestId("urlInput");
    const submitButton = screen.getByRole("button");
    expect(inputElement).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should add input URLs to form", () => {
    render(<Form />);
    const inputElement = screen.getByTestId("urlInput");

    fireEvent.change(inputElement, { target: { value: "https://www.github.com" } });
    expect(inputElement.value).toBe("https://www.github.com");
  });

  it("should update state and render new content after API call", async () => {
    render(<Form />);

    const inputElement = screen.getByTestId("urlInput");

    fireEvent.change(inputElement, { target: { value: "https://www.github.com" } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    fireEvent.change(inputElement, { target: { value: "https://www.wikipedia.org" } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    fireEvent.change(inputElement, { target: { value: "https://www.nytimes.com" } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    const chips = screen.getAllByRole("listitem");
    expect(chips).toHaveLength(3);
  });
});
