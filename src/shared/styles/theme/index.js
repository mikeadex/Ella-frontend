import { colors } from "./color";
import { typography } from "./typography";
import { spacing } from "./spacing";

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
    },
    shadows: {
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
};