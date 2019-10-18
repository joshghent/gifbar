import React from "react";
import { shallow } from "enzyme";
import Spinner from "./spinner";

it("renders without crashing", () => {
  shallow(<Spinner />);
});
