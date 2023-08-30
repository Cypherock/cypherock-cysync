type Case = 'valid' | 'invalid';

export interface ITestData {
  hashing: {
    [key in Case]: {
      message: any;
      expectedHashKey?: string;
    }[];
  };
  encryption: {
    [key in Case]: {
      data: (string | null | undefined)[];
      key: (string | null | undefined)[];
    }[];
  };
  decryption: {
    [key in Case]: {
      data: (string | null | undefined)[];
      key: (string | null | undefined)[];
      decryptionKey: (string | null | undefined)[];
    }[];
  };
}
