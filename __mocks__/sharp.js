const sharpInstance = {
  resize: jest.fn(() => sharpInstance),
  toFile: jest.fn(() => sharpInstance),
}

const sharp = jest.fn(() => sharpInstance)
sharp.concurrency = jest.fn()
sharp.sharpInstance = sharpInstance

module.exports = sharp
