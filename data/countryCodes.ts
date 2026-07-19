import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

export interface CountryCodeOption {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
}

function isoToFlagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(char.charCodeAt(0) + 127397)
    );
}

function getRegionNames() {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
}

const regionNames = getRegionNames();

export const countryCodes: CountryCodeOption[] = getCountries()
  .map((iso2) => ({
    iso2,
    name: regionNames?.of(iso2) ?? iso2,
    dialCode: `+${getCountryCallingCode(iso2)}`,
    flag: isoToFlagEmoji(iso2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const defaultCountryCode =
  countryCodes.find((item) => item.iso2 === "IN") ?? countryCodes[0];
