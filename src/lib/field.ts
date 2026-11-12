// Shared helpers for the random-field demos.

/** Small seeded PRNG, uniform in [0, 1). */
export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fill re/im with unit complex Gaussian noise. */
export function gaussianNoise(rnd: () => number, re: Float32Array, im: Float32Array) {
  for (let i = 0; i < re.length; i++) {
    const r = Math.sqrt(-2 * Math.log(1 - rnd()));
    const p = 2 * Math.PI * rnd();
    re[i] = r * Math.cos(p);
    im[i] = r * Math.sin(p);
  }
}

/**
 * In-place 2D FFT on an n x n grid (n a power of two), row-major re/im.
 * The sign convention does not matter for the demos: the input is random noise.
 */
export function makeFft2(n: number) {
  const logN = Math.log2(n);
  const rev = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    let r = 0;
    for (let b = 0; b < logN; b++) r |= ((i >> b) & 1) << (logN - 1 - b);
    rev[i] = r;
  }
  const cosT = new Float32Array(n / 2);
  const sinT = new Float32Array(n / 2);
  for (let i = 0; i < n / 2; i++) {
    cosT[i] = Math.cos((2 * Math.PI * i) / n);
    sinT[i] = Math.sin((2 * Math.PI * i) / n);
  }
  function fft(re: Float32Array, im: Float32Array) {
    for (let i = 0; i < n; i++) {
      const j = rev[i];
      if (j > i) {
        let t = re[i];
        re[i] = re[j];
        re[j] = t;
        t = im[i];
        im[i] = im[j];
        im[j] = t;
      }
    }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1;
      const step = n / size;
      for (let s = 0; s < n; s += size) {
        for (let j = 0, k = 0; j < half; j++, k += step) {
          const a = s + j;
          const b = a + half;
          const tr = re[b] * cosT[k] - im[b] * sinT[k];
          const ti = re[b] * sinT[k] + im[b] * cosT[k];
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
  }
  const colRe = new Float32Array(n);
  const colIm = new Float32Array(n);
  return (re: Float32Array, im: Float32Array) => {
    for (let j = 0; j < n; j++) fft(re.subarray(j * n, (j + 1) * n), im.subarray(j * n, (j + 1) * n));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        colRe[j] = re[j * n + i];
        colIm[j] = im[j * n + i];
      }
      fft(colRe, colIm);
      for (let j = 0; j < n; j++) {
        re[j * n + i] = colRe[j];
        im[j * n + i] = colIm[j];
      }
    }
  };
}
