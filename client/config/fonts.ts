import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Comfortaa as FontComfortaa,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontComfortaa = FontComfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});
