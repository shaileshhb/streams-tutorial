const fspromises = require("fs/promises")
const fs = require("fs")

const badMemoryCopy = async () => {
  try {
    const destFile = await fspromises.open("text-copy.txt", "w")

    // readFile will store all the contents of file in memory which could lead to memory usuage issues
    const srcFile = await fspromises.readFile('../src.txt')

    await destFile.write(srcFile)
  } catch (error) {
    console.error(error);
  }
}

// badMemoryCopy()

const slowSpeedCopy = async () => {
  try {
    console.time("copyUsingRead")
    const srcFile = await fspromises.open('../src.txt')
    const destFile = await fspromises.open("text-copy.txt", "w")

    let bytesRead = -1

    while (bytesRead !== 0) {
      const readResult = await srcFile.read()
      bytesRead = readResult.bytesRead

      if (bytesRead !== 16384) {
        const indexOfZero = readResult.buffer.indexOf(0)
        const newBuffer = Buffer.alloc(indexOfZero)
        readResult.buffer.copy(newBuffer, 0, 0, indexOfZero)
        destFile.write(newBuffer)
        continue
      }
      destFile.write(readResult.buffer)
    }

    console.timeEnd("copyUsingRead")
  } catch (error) {
    console.error(error);
  }
}

// slowSpeedCopy() // takes ~81ms for 1000000 records


const streamCopy = async () => {
  try {
    console.time("streamCopy")
    const readStream = fs.createReadStream("../src.txt")
    const writeStream = fs.createWriteStream("../text-copy.txt")

    readStream.pipe(writeStream)

    readStream.on("end", () => {
      console.timeEnd("streamCopy")
    })
  } catch (error) {
    console.error(error);
  }

}

streamCopy() // takes ~70ms for 1000000 records