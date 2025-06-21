const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const yellow = "#FFB700";
const midDarkYellow = "#DC9E00";
const darkYellow = "#AA7A00";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    yellow,
    midDarkYellow,
    darkYellow,
    gray: "#ccc",
    danger: "#ff0000",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    yellow: midDarkYellow,
    midDarkYellow,
    darkYellow,
  },
};
