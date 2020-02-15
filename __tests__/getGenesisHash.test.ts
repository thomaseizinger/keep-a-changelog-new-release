import getGenesisHash from "../src/getGenesisHash";

it("should return a hash", async function() {
  const hash = await getGenesisHash();

  expect(hash).toHaveLength(40);
});
