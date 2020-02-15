import formatDate from "../src/formatDate";

it("should format a date with a single digit day correctly", function() {
  const date = new Date(Date.parse("Dec 09 2019"));

  const formatted = formatDate(date);

  expect(formatted).toEqual("2019-12-09");
});

it("should format a date with a double digit day correctly", function() {
  const date = new Date(Date.parse("Dec 16 2019"));

  const formatted = formatDate(date);

  expect(formatted).toEqual("2019-12-16");
});

it("should format a date with a single digit month correctly", function() {
  const date = new Date(Date.parse("Jan 09 2019"));

  const formatted = formatDate(date);

  expect(formatted).toEqual("2019-01-09");
});
