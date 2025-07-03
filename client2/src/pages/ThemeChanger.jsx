import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../atoms";
import { defineTheme } from "../lib/defineTheme";
import customStyles  from "../constants/customStyles";

const ThemeChanger = () => {
  const [theme, changeTheme] = useAtom(themeAtom);
  const handleThemeChange = (theme) =>{
    defineTheme(theme.value).then((_)=>{
      changeTheme(theme);
    })
  }
  useEffect(()=>{
    defineTheme("amy").then((_)=>{
      changeTheme(theme)
    })
  })
  return (
    <Select
      placeholder={`Select Theme`}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      onChange={handleThemeChange}
      styles={customStyles}
    />
  );
};

export default ThemeChanger;
