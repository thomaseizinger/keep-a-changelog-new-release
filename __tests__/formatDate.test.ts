import formatDate from "../src/formatDate";

it.each([
  ["Dec 09 2019", "2019-12-09"],
  ["Dec 16 2019", "2019-12-16"],
  ["Jan 09 2019", "2019-01-09"],
])("should format '%s' as '%s'", function (given, expected) {
  const date = new Date(Date.parse(given));

  const formatted = formatDate(date);

  expect(formatted).toEqual(expected);
});
