const yellow = "\x1b[33m"
const white = "\x1b[0m"
const green = "\x1b[32m"
const dim = "\x1b[2m"
const red = "\x1b[31m"
const div = "\n-------------------------------------"
const wrapDim = (a: any) => "   " + white + dim + a + white + red


export function done(title: string | number) {
  console.log(white, green, title, white, div)
}


export function progress(num: string | number, dec?: string | number) {
  if (!num) return

  if (dec == null) return console.log(wrapDim(num))

  process.stdout.write(wrapDim(num + "/" + dec) + "\r")
}


export function start(title: string | number) {
  console.log(white, yellow, title, white)
}
