import { DM_Sans, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/index.css";
import cn from "classnames";
import localFont from "next/font/local";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-dm-sans" 
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

// English font
const lbcRegular = localFont({
  src: "../public/fonts/lbc-regular-.otf",
  variable: "--font-lbc-regular",
  weight: "400",
});

// Arabic fonts
const ibmPlexArabicThin = localFont({
  src: "../public/fonts/IBMPlexSansArabic-Thin.ttf",
  variable: "--font-ibm-arabic-thin",
  weight: "100",
});

const ibmPlexArabicExtraLight = localFont({
  src: "../public/fonts/IBMPlexSansArabic-ExtraLight.ttf",
  variable: "--font-ibm-arabic-extralight",
  weight: "200",
});

const ibmPlexArabicLight = localFont({
  src: "../public/fonts/IBMPlexSansArabic-Light.ttf",
  variable: "--font-ibm-arabic-light",
  weight: "300",
});

const ibmPlexArabicRegular = localFont({
  src: "../public/fonts/IBMPlexSansArabic-Regular.ttf",
  variable: "--font-ibm-arabic-regular",
  weight: "400",
});

const ibmPlexArabicMedium = localFont({
  src: "../public/fonts/IBMPlexSansArabic-Medium.ttf",
  variable: "--font-ibm-arabic-medium",
  weight: "500",
});

const ibmPlexArabicSemiBold = localFont({
  src: "../public/fonts/IBMPlexSansArabic-SemiBold.ttf",
  variable: "--font-ibm-arabic-semibold",
  weight: "600",
});

export const metadata = {
  title: "Al Hulool Al Muthla - Real Estate Website Template",
  description:
    "Al Hulool Al Muthla is a real estate website template that helps you to find the best property for you.",
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={cn(
          inter.variable,
          dmSans.variable,
          plusJakartaSans.variable,
          lbcRegular.variable,
          ibmPlexArabicThin.variable,
          ibmPlexArabicExtraLight.variable,
          ibmPlexArabicLight.variable,
          ibmPlexArabicRegular.variable,
          ibmPlexArabicMedium.variable,
          ibmPlexArabicSemiBold.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
