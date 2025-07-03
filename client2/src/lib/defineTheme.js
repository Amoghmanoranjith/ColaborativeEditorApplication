import { loader } from '@monaco-editor/react';
import monacoThemes from 'monaco-themes/themes/themelist';

function defineTheme(theme) {
  // console.log(monacoThemes['amy'], theme)
  return new Promise((res) => {
    Promise.all([
      loader.init(),
      import(`../../node_modules/monaco-themes/themes/${monacoThemes[theme]}.json`),
    ]).then(([monaco, themeData]) => {
      monaco.editor.defineTheme(theme, themeData);
      res(void 0);
    });
  });
}

export {defineTheme}