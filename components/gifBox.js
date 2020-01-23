import React, {useEffect, useState} from 'react';
import dotenv from 'dotenv';
import {CompositeGifProvider, GiphyGifProvider, TenorGifProvider} from '@jych/gif-provider';

import Spinner from './spinner';
import {useDebounce} from '../tools/customHooks';
import {GifList} from './gifList';

// todo the API keys should not be in the git repo
const giphyGifProvider = new GiphyGifProvider('bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin');
const tenorGifProvider = new TenorGifProvider('Y91ZIZBKZ3DL');
const gifProvider = new CompositeGifProvider([giphyGifProvider, tenorGifProvider]);

dotenv.config();
const WAIT_INTERVAL = 1000;

export const GifBox = () => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(null);
    const [gifs, setGifs] = useState([]);

    const debouncedSearch = useDebounce(search, WAIT_INTERVAL);

    const triggerSearch = (searchValue) => {
        setCopied(null);

        if(!searchValue) {
            gifProvider.trending(30).then(setGifs);
        } else {
            gifProvider.search(searchValue, 30).then(setGifs);
        }
    };

    useEffect(() => {

        triggerSearch(debouncedSearch);
    }, [debouncedSearch]);


    const handleSearchChange = (e) =>
        setSearch(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            triggerSearch(search); // force triggering search with not debounced search value
        }
    };

    const content = gifs ? (
        <GifList
            gifs={gifs}
            copied={copied}
            handleGifClick={setCopied}
        />
    ) : <Spinner/>;

    return (
        <React.Fragment>
            <input
                type='text'
                className='search-input'
                placeholder='🔍 Search GIFs'
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
            />
            {content}
        </React.Fragment>
    );
};
