import { act, render, waitFor } from "@testing-library/react";
import { fetchUserData } from "./Forms.jsx";

jest.mock("./Forms.jsx", () => ({
  fetchUserData: jest.fn(),
}));

test("fetchUserData returns with the correct data", async () => {
  fetchUserData.mockResolvedValue({
    name: "Don Jhoe",
    email: "donjhoe@fanfiction.com",
    phone: "123-456-7890",
  });

  const data = await fetchUserData();
  expect(data).toEqual({
    name: "Don Jhoe",
    email: "donjhoe@fanfiction.com",
    phone: "123-456-7890",
  });
});
