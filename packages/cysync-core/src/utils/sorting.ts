export interface TokenType {
  leftImage: React.ReactNode;
  arrow?: React.ReactNode;
  text: string;
  tokenAmount: string;
  tokenValue: string;
}

export interface DataType {
  arrow?: React.ReactNode;
  leftImage: React.ReactNode;
  text: string;
  subText?: string;
  tag?: string;
  statusImage: React.ReactNode;
  tokenAmount: string;
  tokenValue: string;
  tokens?: TokenType[];
}
export const convertToNumber = (value: string): number =>
  parseFloat(value.replace(/[^0-9.]/g, ''));

export const sortData = (
  data: DataType[],
  key: keyof DataType,
  direction: 'asc' | 'desc',
): DataType[] =>
  data.sort((a, b) => {
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return direction === 'asc'
        ? (a[key] as string).localeCompare(b[key] as string)
        : (b[key] as string).localeCompare(a[key] as string);
    }

    const aValue = convertToNumber(a[key] as string);
    const bValue = convertToNumber(b[key] as string);
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

export const sortTokens = (
  tokens: TokenType[],
  key: keyof TokenType,
  direction: 'asc' | 'desc',
): TokenType[] => {
  tokens.sort((a, b) => {
    const aValue = key === 'text' ? a[key] : convertToNumber(a[key] as string);
    const bValue = key === 'text' ? b[key] : convertToNumber(b[key] as string);
    return direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return tokens;
};

export const searchFilter = (
  searchTerm: string,
  data: DataType[] = [],
): DataType[] => {
  if (!searchTerm) {
    return data;
  }

  return data
    .filter(row => {
      if (row.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }

      return row.tokens
        ? row.tokens.some(token =>
            token.text.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : false;
    })
    .map(row => {
      if (row.tokens) {
        return {
          ...row,
          tokens: row.tokens.filter(token =>
            token.text.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        };
      }
      return row;
    });
};
