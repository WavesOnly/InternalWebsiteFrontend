import { useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createTheme } from "@mui/material/styles";

import { setDisplayMode } from "./slices/user/userSlice";

export const colorTokens = (displayMode) => ({
    ...(displayMode === "dark"
        ? {
            grey: {
                100: "#e0e0e0",
                200: "#c2c2c2",
                300: "#a3a3a3",
                400: "#858585",
                500: "#666666",
                600: "#525252",
                700: "#3d3d3d",
                800: "#292929",
                900: "#141414"
            },
            primary: {
                100: "#d0d0d0",
                200: "#a0a0a0",
                300: "#717171",
                400: "#414141",
                500: "#121212",
                600: "#0e0e0e",
                700: "#0b0b0b",
                800: "#070707",
                900: "#040404"
            },
            greenAccent: {
                100: "#cfdfe2",
                200: "#9fbfc5",
                300: "#6f9ea8",
                400: "#3f7e8b",
                500: "#0f5e6e",
                600: "#0c4b58",
                700: "#093842",
                800: "#06262c",
                900: "#031316"
            },
            redAccent: {
                100: "#f8dcdb",
                200: "#f1b9b7",
                300: "#e99592",
                400: "#e2726e",
                500: "#db4f4a",
                600: "#af3f3b",
                700: "#832f2c",
                800: "#58201e",
                900: "#2c100f"
            },
            blueAccent: {
                100: "#e1e2fe",
                200: "#c3c6fd",
                300: "#a4a9fc",
                400: "#868dfb",
                500: "#6870fa",
                600: "#535ac8",
                700: "#3e4396",
                800: "#2a2d64",
                900: "#151632"
            },
        }
        : {
            grey: {
                100: "#141414",
                200: "#292929",
                300: "#3d3d3d",
                400: "#525252",
                500: "#666666",
                600: "#858585",
                700: "#a3a3a3",
                800: "#c2c2c2",
                900: "#e0e0e0"
            },
            primary: {
                100: "#040404",
                200: "#070707",
                300: "#0b0b0b",
                400: "#f2f0f0",
                500: "#121212",
                600: "#414141",
                700: "#717171",
                800: "#a0a0a0",
                900: "#d0d0d0"
            },
            greenAccent: {
                100: "#031316",
                200: "#06262c",
                300: "#093842",
                400: "#0c4b58",
                500: "#0f5e6e",
                600: "#3f7e8b",
                700: "#6f9ea8",
                800: "#9fbfc5",
                900: "#cfdfe2"
            },
            redAccent: {
                100: "#2c100f",
                200: "#58201e",
                300: "#832f2c",
                400: "#af3f3b",
                500: "#db4f4a",
                600: "#e2726e",
                700: "#e99592",
                800: "#f1b9b7",
                900: "#f8dcdb"
            },
            blueAccent: {
                100: "#151632",
                200: "#2a2d64",
                300: "#3e4396",
                400: "#535ac8",
                500: "#6870fa",
                600: "#868dfb",
                700: "#a4a9fc",
                800: "#c3c6fd",
                900: "#e1e2fe"
            },
        }
    )
})

export const themeSettings = (displayMode) => {
    const colors = colorTokens(displayMode);

    return {
        palette: {
            mode: displayMode,
            ...(displayMode === "dark"
                ? {
                    primary: { main: colors.primary[500] },
                    secondary: { main: "#0f5e6e" },
                    neutral: { dark: colors.grey[700], main: colors.grey[500], light: colors.grey[100] },
                    background: { default: colors.primary[500] },
                    layer: { default: "#1d1d1d" }
                } : {
                    primary: { main: colors.primary[100] },
                    secondary: { main: "#0f5e6e" },
                    neutral: { dark: colors.grey[700], main: colors.grey[500], light: colors.grey[100] },
                    background: { default: "#f6f7f8" },
                    layer: { default: "#fff" }
                }
            )
        },
        typography: {
            fontFamily: ["Roboto", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 40
            },
            h2: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 32
            },
            h3: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 24
            },
            h4: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 20
            },
            h5: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 16
            },
            h6: {
                fontFamily: ["Roboto", "sans-serif"].join(","),
                fontSize: 14
            },
        },
        components: {
            MuiAlert: {
                styleOverrides: {
                    standardSuccess: {
                        backgroundColor: "rgb(237, 247, 237)",
                        color: "rgb(30, 70, 32)",
                    },
                    standardInfo: {
                        backgroundColor: "rgb(229, 246, 253)",
                        color: "rgb(1, 67, 97)",
                    },
                    standardWarning: {
                        backgroundColor: "rgb(255, 244, 229)",
                        color: "rgb(102, 60, 0)",
                    },
                    standardError: {
                        backgroundColor: "rgb(253, 237, 237)",
                        color: "rgb(95, 33, 32)",
                    },
                }
            }
        }
    }
};

export const useDisplayMode = () => {
    const dispatch = useDispatch();
    const displayMode = useSelector((state) => state.user.displayMode);

    const displayColorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                const newDisplayMode = displayMode === 'light' ? 'dark' : 'light';
                dispatch(setDisplayMode(newDisplayMode));
                localStorage.setItem('displayMode', newDisplayMode);
            },
        }),
        [displayMode, dispatch]
    );

    const theme = useMemo(() => createTheme(themeSettings(displayMode)), [displayMode]);

    return [theme, displayColorMode];
};
