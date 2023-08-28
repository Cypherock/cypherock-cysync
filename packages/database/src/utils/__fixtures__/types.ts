type Case = 'valid' | 'invalid';

export type TestData = {
  [key in Case]: {
    hashing: {
      message: string | null | undefined;
      expectedHashKey: string;
    }[];
    encryption: {
      data: string[] | null | undefined;
      message: string[] | null | undefined;
    }[];
  };
};
