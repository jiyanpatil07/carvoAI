import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./index"; // Import your Home component

describe("Home Component", () => {
  it("renders the Home component", () => {
    render(<Home launches={[]} />);
    const title = screen.getByText("SpaceX Launch Programs");
    expect(title).toBeInTheDocument();
  });

  it("performs filtering when buttons are clicked", () => {
    // Render the Home component with initial props
    const { rerender } = render(<Home launches={[]} });

    // Simulate a button click for year filter
    const yearButton = screen.getByText("2006");
    userEvent.click(yearButton);
    // Add your assertions here to check if the filter is working as expected

    // Rerender with new props if necessary
    rerender(<Home launches={[]} 
    });

    // Simulate button clicks for other filters
    // Add your assertions for other filters
  });
});

describe("LaunchCard Component", () => {
  it("renders the LaunchCard component", () => {
    const launchData = {
      mission_name: "Test Mission",
      flight_number: 1,
      mission_id: ["test-id-1", "test-id-2"],
      launch_year: "2022",
      launch_success: true,
      rocket: {
        first_stage: {
          cores: [{ land_success: true }],
        },
      },
      links: {
        article_link: "https://example.com",
        mission_patch: "https://example.com/mission.png",
      };

    render(<Home launches={[launchData]}); // Render the Home component with data
    const title = screen.getByText("Test Mission #1");
    expect(title).toBeInTheDocument();
    // Add more assertions to check if all data is displayed correctly
  });
});
