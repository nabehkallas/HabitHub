/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0D47A1'; // Deep Blue
const tintColorDark = '#E3F2FD'; // Light Blue

export const Colors = {
  light: {
    text: '#212121', // Dark Gray
    background: '#FFFFFF', // White
    tint: tintColorLight,
    icon: '#757575', // Medium Gray
    tabIconDefault: '#757575',
    tabIconSelected: tintColorLight,
    primary: '#0D47A1',
    light: '#E3F2FD',
    dark: '#002171',
    placeholder: '#707070ff', // Lighter Gray for placeholders
    placeholderDark: '#616161', // Darker Gray for placeholders
    error: '#D32F2F',
  },
  dark: {
    text: '#ECEDEE', // Light Gray
    background: '#121212', // Dark Background
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#0D47A1',
    light: '#E3F2FD',
    dark: '#002171',
    placeholder: '#757575', // Medium Gray for placeholders
    error: '#EF5350', // Lighter Red for dark mode
  },
};