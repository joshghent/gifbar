import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import Spinner from "./Spinner.svelte";

describe("Spinner", () => {
  it("renders without crashing", () => {
    const { container } = render(Spinner);
    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });
});
