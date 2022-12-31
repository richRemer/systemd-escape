import expect from "expect.js";
import escape from "systemd-escape";

const num = "0123456789";
const alphaLC = "abcdefghijklmnopqrstuvwxyz";
const alphaUC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

describe("escape(string)", () => {
  it("should not escape alphanumeric characters", () => {
    const testString = num+alphaLC+alphaUC;
    expect(escape(testString)).to.be(testString);
  });

  it("should not escape '.', ':', or '_'", () => {
    const testString = "a.b:c_d";
    expect(escape(testString)).to.be(testString);
  });

  it("should replace '/' with '-'", () => {
    const testString = "a/b";
    expect(escape(testString)).to.be("a-b");
  });

  it("should throw if string contains NUL character", () => {
    const testString = "\x00";
    expect(() => escape(testString)).to.throwError();
  });

  it("should apply C-style escapes to other characters", () => {
    const testString = "@á";
    expect(escape(testString)).to.be("\\x40\\xc3\\xa1");
  });
});

