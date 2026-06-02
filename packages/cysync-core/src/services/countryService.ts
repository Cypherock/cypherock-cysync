const COUNTRY_API_URL = 'https://api.country.is/';

export const getUserCountry = async (): Promise<string | undefined> => {
  try {
    const res = await fetch(COUNTRY_API_URL);
    const data = await res.json();
    return (data.country as string | undefined) ?? undefined;
  } catch {
    return undefined;
  }
};
