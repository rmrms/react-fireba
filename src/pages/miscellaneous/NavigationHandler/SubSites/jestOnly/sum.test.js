import { sum } from "./sum";

// const sum = require("./sum");

test("2 + 3 = 5 kell legyen", () => {
  expect(sum(2, 3)).toBe(5);
});
