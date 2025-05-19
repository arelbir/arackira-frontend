import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: 'Temayı Değiştir',
      shortcut: ['t', 't'],
      section: 'Tema',
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: 'Açık Tema',
      section: 'Tema',
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: 'Koyu Tema',
      section: 'Tema',
      perform: () => setTheme('dark')
    }
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
