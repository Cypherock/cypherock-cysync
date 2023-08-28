type Case = 'valid' | 'invalid';

export type TestData = {
  [key in Case]: {
    hashing: {
      message: string;
      expectedHashKey: string;
    }[];
    encryption: {
      data: string[] | null | undefined;
      message: string[] | null | undefined;
    }[];
  };
};
