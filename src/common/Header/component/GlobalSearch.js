import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { handleGlobalSearchSelect } from '../../../helpers/GlobalSearchHelper';
import { useOnClickOutside } from '../../../hooks/UserClickOutsideHook';
import { searchGlobalData } from '../redux/HeaderAction';
import { HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS } from '../redux/HeaderConstants';

const GlobalSearch = () => {
  const history = useHistory();
  const headerSearchRef = useRef();
  const dispatch = useDispatch();
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const [searchedString, setSearchedString] = useState('');
  const [searchStart, setSearchStart] = useState(false);
  const [cursor, setCursor] = useState(-1);

  const globalSearchResult = useSelector(
    ({ globalSearchReducer }) => globalSearchReducer?.searchResults ?? []
  );

  const searchOnFocus = () => setHeaderSearchFocused(true);
  const searchOutsideClick = () => {
    setSearchStart(false);
    setHeaderSearchFocused(false);
  };
  useOnClickOutside(headerSearchRef, searchOutsideClick);

  const target = document.getElementsByClassName('header-search-results')?.[0];

  const onSearchEnterKeyPress = useCallback(
    e => {
      if (globalSearchResult?.length > 0) {
        if (e.keyCode === 40) {
          setHeaderSearchFocused(false);
          if (cursor === -1 || cursor >= globalSearchResult?.length - 1) {
            setCursor(0);
            target.scrollTop = 0;
          } else {
            setCursor(prev => prev + 1);
            target.scrollTop += 37;
          }
        }
        if (e.keyCode === 38) {
          setHeaderSearchFocused(false);
          setCursor(prev => prev - 1);
          target.scrollTop -= 37;
          if (cursor <= 0) {
            setCursor(globalSearchResult?.length - 1);
            target.scrollTop = target.scrollHeight;
          }
        }
      }
      if (e.keyCode === 13) {
        const { value } = e?.target;
        if (value?.trim()?.length > 0 && headerSearchFocused) {
          setSearchStart(true);
          dispatch(searchGlobalData(value));
        } else {
          handleGlobalSearchSelect(globalSearchResult?.[cursor], history);
          setSearchStart(false);
          setSearchedString('');
        }
      }
    },
    [setSearchStart, cursor, globalSearchResult?.length, headerSearchFocused, target]
  );

  const handleOnSearchChange = useCallback(e => {
    setSearchedString(e?.target?.value);
    setHeaderSearchFocused(true);
    if (e?.target?.value?.trim()?.length === 0) {
      setSearchStart(false);
      dispatch({
        type: HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.CLEAR_SEARCHED_DATA_LIST,
      });
    }
  }, []);

  return (
    <div
      ref={headerSearchRef}
      className={`header-search-container ${
        headerSearchFocused && 'header-search-container-focused'
      } ${searchStart && 'got-search-results'}`}
    >
      <div>
        <input
          type="text"
          placeholder="Search Here"
          onFocus={searchOnFocus}
          onKeyDown={onSearchEnterKeyPress}
          onChange={handleOnSearchChange}
          value={searchedString}
        />
        <span className="material-icons-round">search</span>
      </div>
      {searchStart && (
        <ul className="header-search-results">
          {searchStart && globalSearchResult?.length > 0 ? (
            globalSearchResult?.map((searchResult, index) => (
              <li
                className={index === cursor && 'header-active-search'}
                onClick={() => {
                  handleGlobalSearchSelect(searchResult, history);
                  setSearchStart(false);
                  setSearchedString('');
                }}
              >
                {searchResult?.title}
              </li>
            ))
          ) : (
            <li>No Record Found</li>
          )}
        </ul>
      )}
    </div>
  );
};
export default GlobalSearch;
