/**
 * Parse ignoreFile string; adapted from the npm package `ignore-file`
 * @source https://github.com/mafintosh/ignore-file
 */

import { makeRe } from "minimatch"

const falsy = () => false
const toFunction = (regexp: RegExp) => (input: string) => regexp.test(input)
const or = (a: any, b: any) => (a === falsy) ? b : (input: string) => a(input) || b(input)

function toRegExp(pattern: string) {
  const i = pattern.indexOf("/")

  if (i === -1 || i === pattern.length - 1) {
    pattern = makeRe(pattern, { dot: true }).toString()
      .replace(/^\/\^/, "/(^|\\/)")
      .replace(/\$\/$/, "($|\\/)/")
    return new RegExp(pattern.slice(1, -1), "i")
  }

  if (i === 0) pattern = pattern.slice(1)

  return makeRe(pattern, { dot: true, nocase: true })
}

export function ignore(ignoreFile: string | string[]) {
  const lines = ((typeof ignoreFile === "string") ? ignoreFile.split("\n") : ignoreFile)
    .map(line => line.trim())
    .filter(line => line && line[0] !== "#")

  const negative = lines
    .filter(line => line[0] !== "!")
    .map(toRegExp)
    .map(toFunction)
    .reduce(or, falsy)

  const positive = lines
    .filter(line => line[0] === "!")
    .map(line => line.slice(1))
    .map(toRegExp)
    .map(toFunction)
    .reduce(or, falsy)

  return function test(filename: string) {
    return !(!positive(filename) && negative(filename))
  }
}
