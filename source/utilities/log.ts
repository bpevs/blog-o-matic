const yellow = "\x1b[33m";
const white = "\x1b[0m";
const green = "\x1b[32m";
const dim = "\x1b[2m";
const red = "\x1b[31m";

const div = "\n-------------------------------------\n";
const wrapDim = a => white + dim + a + white + red;

export function done(title) {
  console.log(white, div, green, title, white, div);
}


export function progress(num, dec?) {
  if (dec == null) {
    console.log(wrapDim(num));
  } else {
    process.stdout.write(wrapDim(num + "/" + dec + "\r"));
  }
}


export function start(title) {
  console.log(white, div, yellow, title, white, div);
}
