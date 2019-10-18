const { getProviders } = require("./GifProviderFactory");

it("Returns an empty array when .getProviders finds nothing", async () => {

    expect(getProviders()).toHaveLength(0);
    expect(getProviders([])).toHaveLength(0);
    expect(getProviders([ "foo", "bar" ])).toHaveLength(0);
});

it("Returns an array of matching GifProviders when .getProviders finds a match", async () => {

    expect(getProviders([ "giphy" ])).toHaveLength(1);
    expect(getProviders([ "giphy", "baz" ])).toHaveLength(1);
});
