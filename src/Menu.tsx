import * as React from "react";
import {
  useFocusable,
  init,
  FocusContext
} from "@noriginmedia/norigin-spatial-navigation";
import styled from "styled-components";

init({
  debug: false,
  visualDebug: false
});

// INTERFACES
interface MenuItemBoxProps {
  focused: boolean;
}

interface MenuWrapperProps {
  hasFocusedChild: boolean;
}

interface MenuProps {
  focusKey: string;
  onGenreSelect: (genre: string) => void;
}

// STYLED COMPONENTS
const MenuItemBox = styled.div<MenuItemBoxProps>`
  width: 170px;
  height: 60px;
  background-color: #95a5a6;
	transition: 0.3s all;
  border-color: white;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? "3px" : 0)};
  color: ${({ focused }) => (focused ? "white" : "black")};
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 37px;
	cursor: pointer;
`;

const MenuWrapper = styled.div<MenuWrapperProps>`
  flex: 1;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ hasFocusedChild }) =>
    hasFocusedChild ? "#34495e" : "#2c3e50"};
  padding-top: 40px;
`;

// METHODS CONSTS AND FUNCS

// CONSTS

// FUNCS
function MenuItem({
  focusKey: focusKeyParam,
  title,
  onSelect
}: {
  focusKey: string,
  title: string,
  onSelect: () => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: focusKeyParam,
    onEnterPress: onSelect,
  });

  return (
    <MenuItemBox ref={ref} focused={focused} onClick={onSelect}>
      <h4 style={{ textAlign: 'center' }}>{title}</h4>
    </MenuItemBox>
  );
}

export function Menu({ focusKey: focusKeyParam, onGenreSelect }: MenuProps) {

  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    focusKey: focusKeyParam,
    preferredChildFocusKey: undefined,
    onEnterPress: () => { },
    onEnterRelease: () => { },
    onArrowPress: () => true,
    onFocus: () => { },
    onBlur: () => { },
  });

  const handleGenreSelect = (genre: string) => {
    onGenreSelect(genre);
  };

  React.useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <MenuWrapper ref={ref} hasFocusedChild={hasFocusedChild}>
        <img src="https://styles.redditmedia.com/t5_2su6s/styles/communityIcon_4g1uo0kd87c61.png" alt="Logo" width={150} height={150} style={{ marginBottom: '15px' }} />
        <MenuItem
          focusKey="menu-1"
          title={'All Genres'}
          onSelect={() => handleGenreSelect('All Genres')}
        />
        <MenuItem
          focusKey="menu-2"
          title={'Action'}
          onSelect={() => handleGenreSelect('Action')}
        />
        <MenuItem
          focusKey="menu-3"
          title={'Horror'}
          onSelect={() => handleGenreSelect('Horror')}
        />
        <MenuItem
          focusKey="menu-4"
          title={'Science Fiction'}
          onSelect={() => handleGenreSelect('Science Fiction')}
        />
        <MenuItem
          focusKey="menu-5"
          title={'Animation'}
          onSelect={() => handleGenreSelect('Animation')}
        />
        <MenuItem
          focusKey="menu-6"
          title={'Drama'}
          onSelect={() => handleGenreSelect('Drama')}
        />
      </MenuWrapper>
    </FocusContext.Provider>
  );
}
