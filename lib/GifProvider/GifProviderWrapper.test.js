const GifProviderWrapper = require("./GifProviderWrapper");
const GifProvider = require("./GifProvider");

// tests for having an empty providers list

it("Can be instantiated with an empty 'providers' list", async () => {

    expect( () => new GifProviderWrapper() ).not.toThrow();
    expect( () => new GifProviderWrapper([]) ).not.toThrow();
});

it("Returns an empty array when .trending is called if instantiated with an empty 'providers' list", async () => {
    const gifProviderWrapper = new GifProviderWrapper();

    expect(await gifProviderWrapper.trending()).toHaveLength(0);
});

it("Returns an empty array when .search is called if instantiated with an empty 'providers' list", async () => {
    const gifProviderWrapper = new GifProviderWrapper();

    expect(await gifProviderWrapper.search("funny")).toHaveLength(0);
});

// tests for having one or more providers

it("Can be instantiated with a non-empty 'providers' list", async () => {
    const gifProvider = new GifProvider();
    const gifProvider2 = new GifProvider();

    expect( () => new GifProviderWrapper([ gifProvider ]) ).not.toThrow();
    expect( () => new GifProviderWrapper([ gifProvider, gifProvider2 ]) ).not.toThrow();
});

it("Returns a flattened array of the wrapped providers' results when .trending is called", async () => {
    const mockGifProvider = new class {
        trending() { return Promise.resolve([ "foo", "bar", "bing" ]); }
    };
    const mockGifProvider2 = new class {
        trending() { return Promise.resolve([ "dee", "goo", "naa" ]); }
    };
    const mockGifProvider3 = new class {
        trending() { return Promise.reject(); }
    };
    const gifProviderWrapper = new GifProviderWrapper([ mockGifProvider ]);
    const gifProviderWrapper2 = new GifProviderWrapper([ mockGifProvider, mockGifProvider2 ]);
    const gifProviderWrapper3 = new GifProviderWrapper([ mockGifProvider, mockGifProvider3 ]);

    expect(await gifProviderWrapper.trending()).toHaveLength(3);
    expect(await gifProviderWrapper2.trending()).toHaveLength(6);
    expect(await gifProviderWrapper3.trending()).toHaveLength(3);
});

it("Returns a flattened array of the wrapped providers' results when .search is called", async () => {
    const mockGifProvider = new class {
        search() { return Promise.resolve([ "foo", "bar", "bing" ]); }
    };
    const mockGifProvider2 = new class {
        search() { return Promise.resolve([ "dee", "goo", "naa" ]); }
    };
    const mockGifProvider3 = new class {
        search() { return Promise.reject(); }
    };
    const gifProviderWrapper = new GifProviderWrapper([ mockGifProvider ]);
    const gifProviderWrapper2 = new GifProviderWrapper([ mockGifProvider, mockGifProvider2 ]);
    const gifProviderWrapper3 = new GifProviderWrapper([ mockGifProvider, mockGifProvider3 ]);

    expect(await gifProviderWrapper.search()).toHaveLength(3);
    expect(await gifProviderWrapper2.search()).toHaveLength(6);
    expect(await gifProviderWrapper3.search()).toHaveLength(3);
});
