/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

describe("transports utils - checkISOBMFFIntegrity", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should check just ftyp and and moov integrity for init segments", () => {
    const mockFindCompleteBox = jest.fn(() => 45);
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    expect(() => checkISOBMFFIntegrity(myUint8Array, true)).not.toThrow();
    expect(mockFindCompleteBox).toHaveBeenCalledTimes(2);
    expect(mockFindCompleteBox).toHaveBeenCalledWith(myUint8Array, 0x66747970);
    expect(mockFindCompleteBox).toHaveBeenCalledWith(myUint8Array, 0x6d6f6f76);
  });

  it("should check just moof and and mdat integrity for regular segments", () => {
    const mockFindCompleteBox = jest.fn(() => 45);
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    expect(() => checkISOBMFFIntegrity(myUint8Array, false)).not.toThrow();
    expect(mockFindCompleteBox).toHaveBeenCalledTimes(2);
    expect(mockFindCompleteBox).toHaveBeenCalledWith(myUint8Array, 0x6d6f6f66);
    expect(mockFindCompleteBox).toHaveBeenCalledWith(myUint8Array, 0x6d646174);
  });

  it("should throw an other error if an init segment is missing a complete ftyp", () => {
    const mockFindCompleteBox = jest.fn((_, box) => (box === 0x66747970 ? -1 : 45));
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const OtherError = jest.requireActual("../../../errors").OtherError;
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    let error: unknown = null;
    try {
      checkISOBMFFIntegrity(myUint8Array, true);
    } catch (e: unknown) {
      error = e;
    }
    expect(error).toBeInstanceOf(OtherError);
    expect((error as typeof OtherError).name).toEqual("OtherError");
    expect((error as typeof OtherError).type).toEqual("OTHER_ERROR");
    expect((error as typeof OtherError).code).toEqual("INTEGRITY_ERROR");
    expect((error as typeof OtherError).message).toEqual(
      "INTEGRITY_ERROR: Incomplete `ftyp` box",
    );
  });

  it("should throw an other error if an init segment is missing a complete moov", () => {
    const mockFindCompleteBox = jest.fn((_, box) => (box === 0x6d6f6f76 ? -1 : 45));
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const OtherError = jest.requireActual("../../../errors").OtherError;
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    let error: unknown = null;
    try {
      checkISOBMFFIntegrity(myUint8Array, true);
    } catch (e: unknown) {
      error = e;
    }
    expect(error).toBeInstanceOf(OtherError);
    expect((error as typeof OtherError).name).toEqual("OtherError");
    expect((error as typeof OtherError).type).toEqual("OTHER_ERROR");
    expect((error as typeof OtherError).code).toEqual("INTEGRITY_ERROR");
    expect((error as typeof OtherError).message).toEqual(
      "INTEGRITY_ERROR: Incomplete `moov` box",
    );
  });

  it("should throw an other error if a regular segment is missing a complete moof", () => {
    const mockFindCompleteBox = jest.fn((_, box) => (box === 0x6d6f6f66 ? -1 : 45));
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const OtherError = jest.requireActual("../../../errors").OtherError;
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    let error: unknown = null;
    try {
      checkISOBMFFIntegrity(myUint8Array, false);
    } catch (e: unknown) {
      error = e;
    }
    expect(error).toBeInstanceOf(OtherError);
    expect((error as typeof OtherError).name).toEqual("OtherError");
    expect((error as typeof OtherError).type).toEqual("OTHER_ERROR");
    expect((error as typeof OtherError).code).toEqual("INTEGRITY_ERROR");
    expect((error as typeof OtherError).message).toEqual(
      "INTEGRITY_ERROR: Incomplete `moof` box",
    );
  });

  it("should throw an other error if a regular segment is missing a complete mdat", () => {
    const mockFindCompleteBox = jest.fn((_, box) => (box === 0x6d646174 ? -1 : 45));
    jest.mock("../../../parsers/containers/isobmff", () => ({
      __esModule: true as const,
      findCompleteBox: mockFindCompleteBox,
    }));
    const OtherError = jest.requireActual("../../../errors").OtherError;
    const checkISOBMFFIntegrity = jest.requireActual(
      "../check_isobmff_integrity",
    ).default;
    const myUint8Array = new Uint8Array([0, 1, 2]);
    let error: unknown = null;
    try {
      checkISOBMFFIntegrity(myUint8Array, false);
    } catch (e: unknown) {
      error = e;
    }
    expect(error).toBeInstanceOf(OtherError);
    expect((error as typeof OtherError).name).toEqual("OtherError");
    expect((error as typeof OtherError).type).toEqual("OTHER_ERROR");
    expect((error as typeof OtherError).code).toEqual("INTEGRITY_ERROR");
    expect((error as typeof OtherError).message).toEqual(
      "INTEGRITY_ERROR: Incomplete `mdat` box",
    );
  });
});
