const GifProvider = require('./GifProvider');

it('Returns an empty array when .trending is called', async () => {
    const gifProvider = new GifProvider();

    expect(await gifProvider.trending()).toHaveLength(0);
    expect(await gifProvider.trending(100)).toHaveLength(0);
});

it('Returns an empty array when .search is called', async () => {
    const gifProvider = new GifProvider();

    expect(await gifProvider.search()).toHaveLength(0);
    expect(await gifProvider.search('')).toHaveLength(0);
    expect(await gifProvider.search('', 10)).toHaveLength(0);
});
