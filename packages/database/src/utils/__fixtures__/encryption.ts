import { ITestData } from './types';

export const testData: ITestData = {
  hashing: {
    valid: [
      {
        message:
          'conference therapist cylinder pass commemorate snub license reinforce compromise sphere coffin abridge get headquarters executive popular daughter publicity confusion berry oak spokesperson plagiarize linear',
        expectedHashKey:
          '6ac05d4017d8109cb92ecd7dc250a5a45809959f6587dc14cbba9f03d1c0e8bd',
      },
      {
        message: '',
        expectedHashKey:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        message: 'sampleMessage',
        expectedHashKey:
          '1241577c3bb040e87a647d60bf2b373a09afd40624add04ce7d00321d0bb4678',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        expectedHashKey:
          'a58dd8680234c1f8cc2ef2b325a43733605a7f16f288e072de8eae81fd8d6433',
      },
      {
        message: '🌟🚀🌍',
        expectedHashKey:
          '3dc63fb17f6bbb01b3f9caf052db152aec3f1a7b4954356ae98cf6a941e7f8a7',
      },
      {
        message: '!@#$%^&*()_+',
        expectedHashKey:
          '36d3e1bc65f8b67935ae60f542abef3e55c5bbbd547854966400cc4f022566cb',
      },
    ],
    invalid: [
      {
        message: null,
      },
      {
        message: undefined,
      },
      {
        message: 42,
      },
      {
        message: ['apple', 'banana', 'cherry'],
      },
      {
        message: { key: 'value' },
      },
    ],
  },
  encryption: {
    valid: [
      {
        data: [''],
        key: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
      },
      {
        data: ['sampleData'],
        key: [
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
      },
      {
        data: [
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, doloremque, nisi eaque dicta aspernatur facere maxime cum in impedit accusamus nam suscipit velit eos voluptas nemo deserunt provident, cumque dignissimos!',
        ],
        key: [
          'e150a1d618e90225d12e1b5112f72da6520c4ae54d6d5e753ec98d8c3614016e',
        ],
      },
      {
        data: ['!@#$%^&*()_+-={}[]|:;<>,.?/'],
        key: [
          'd3486ae9136e7856bc42212385ea797094475802891e2e3dffc8a5ed7058822a',
        ],
      },
      {
        data: ['sampleData1', 'sampleData2'],
        key: [
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
      },
      {
        data: ['sampleData', 'sampleData'],
        key: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
      },
      {
        data: ['sampleData1', 'sampleData2'],
        key: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
      },
      {
        data: [
          'xY7Gh2Qm9 FpLwEaKiRs eUbJdNcZtV OoIhGfCxYz mNqPrStUvW AiBjCkDlEm sGtHuIvJwK cXdYeZfAgB TnOpQrRsLt kUlVmWnXoY HzIaJbKcLd qWxYzAbBcD EfGhIjKlMn OpPqRsTuVw XyZaBcDeFg HiJkLmNoPq RsTuVwXyZa BcDeFgHiJk LmNoPqRsTu VwXyZaBcDe fghijklmno pqrstuvwxy zabcdefghi jklmnopqrs tuvwxyzabc defghijklm nopqrstuvw xyzabcdefg hijklmnopq rstuvwxyza bcdefghijk lmnopqrstu vwxyzabcde fghijklmno pqrstuvwxy zabcdefghi jklmnopqrs tuvwxyzabc defghijklm nopqrstuvw',
        ],
        key: [
          '5dcd80714cb9986afe2fb0b178d9fa1a79d57c5611a9f63b7bfec1d14ffd06f1',
        ],
      },
      {
        data: [
          'conference therapist cylinder pass commemorate snub license reinforce compromise sphere coffin abridge get headquarters executive popular daughter publicity confusion berry oak spokesperson plagiarize linear',
        ],
        key: [
          '6ac05d4017d8109cb92ecd7dc250a5a45809959f6587dc14cbba9f03d1c0e8bd',
        ],
      },
    ],
    invalid: [
      {
        data: ['sampleData'],
        key: [null],
      },
      {
        data: ['sampleData'],
        key: [undefined],
      },
      {
        data: [null],
        key: ['sampleKey'],
      },
      {
        data: [undefined],
        key: ['sampleKey'],
      },
      {
        data: ['\xC3\x28'],
        key: ['sampleKey'],
      },
    ],
  },
  decryption: {
    valid: [
      {
        data: [
          'xY7Gh2Qm9 FpLwEaKiRs eUbJdNcZtV OoIhGfCxYz mNqPrStUvW AiBjCkDlEm sGtHuIvJwK cXdYeZfAgB TnOpQrRsLt kUlVmWnXoY HzIaJbKcLd qWxYzAbBcD EfGhIjKlMn OpPqRsTuVw XyZaBcDeFg HiJkLmNoPq RsTuVwXyZa BcDeFgHiJk LmNoPqRsTu VwXyZaBcDe fghijklmno pqrstuvwxy zabcdefghi jklmnopqrs tuvwxyzabc defghijklm nopqrstuvw xyzabcdefg hijklmnopq rstuvwxyza bcdefghijk lmnopqrstu vwxyzabcde fghijklmno pqrstuvwxy zabcdefghi jklmnopqrs tuvwxyzabc defghijklm nopqrstuvw',
        ],
        key: [
          '5dcd80714cb9986afe2fb0b178d9fa1a79d57c5611a9f63b7bfec1d14ffd06f1',
        ],
        decryptionKey: [
          '5dcd80714cb9986afe2fb0b178d9fa1a79d57c5611a9f63b7bfec1d14ffd06f1',
        ],
      },
      {
        data: [''],
        key: [
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
        decryptionKey: [
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
      },
      {
        data: ['c4a12bba7b6c88d9.9f173e7b9b16272f02'],
        key: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
        decryptionKey: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
      },
    ],
    invalid: [
      {
        data: ['c4a12bba7b6c88d9'],
        key: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
        decryptionKey: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a9',
        ],
      },
      {
        data: ['c4a12bba7b6c88d9.9f173e7b9b16272f02'],
        key: [
          '91c1a82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5',
        ],
        decryptionKey: [
          '2a6e89d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
      },
      {
        data: ['c4a12bba7b6c88d9.9f173e7b9b16272f02'],
        key: ['82ca71c39245ea10611525c3a11a7c6ab0986ad6d2b3b56c319df544db5'],
        decryptionKey: [
          '9d7c82b924c31825d6699ef9447e02d149a74fcb6d2f63f2f1c2f1583a8',
        ],
      },
    ],
  },
};
