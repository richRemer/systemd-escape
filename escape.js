export default function escape(string) {
  const bytes = Buffer.from(string, "utf8");
  const maxLength = 4 * bytes.length;
  const buffer = Buffer.alloc(maxLength);

  let offset = 0;

  for (let i=0; i<bytes.length; i++) {
    const byte = bytes[i];
    const mapped = classifier[byte];

    if (typeof mapped === "function") {
      const data = mapped(byte);
      data.copy(buffer, offset);
      offset += data.length;
    } else {
      buffer[offset++] = mapped;
    }
  }

  return buffer.slice(0, offset).toString("utf8");
}

const classifier = buildClassifier();

function buildClassifier() {
  const unusable = [[1,45], [59,64], [91,94], [96,96], [123,255]];
  const slash = "/".charCodeAt(0);
  const hyphen = "-".charCodeAt(0);
  const backslash = "\\".charCodeAt(0);
  const x = "x".charCodeAt(0);

  // start with identity classifiers
  const classifier = Array(256).fill().map((v,i) => i);

  // replace slashes with hyphens
  classifier[slash] = hyphen;
 
  // escape unusable ranges
  for (const [min,max] of unusable) {
    for (let i=min; i<=max; i++) {
      classifier[i] = escape;
    }
  }

  // throw on NUL
  classifier[0] = error;

  return classifier;

  function escape(code) {
    const lo = (code & 0xf).toString(16).charCodeAt(0);
    const hi = (code >> 4 & 0xf).toString(16).charCodeAt(0);
    return Buffer.from([backslash, x, hi, lo]);
  }

  function error() {
    throw new Error("cannot escape NUL character");
  }
}
