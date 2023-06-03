const fspromises = require("fs/promises")
const fs = require("fs")

const slowestWriteToFile = async () => {
  console.time("slowestWriteToFile")
  const file = await fspromises.open("test.txt", "w")

  for (let index = 0; index < 100000; index++) {
    await file.write(`${index} `)
  }

  console.timeEnd("slowestWriteToFile")
}

// slowestWriteToFile()

const callbackWriteToFile = async () => {
  console.time("callbackWriteToFile")
  fs.open("test.txt", "w", async (err, fd) => {
    if (err) {
      console.log(err);
      return
    }

    for (let index = 0; index < 1000000; index++) {
      // fs.write(fd, `${index} `, () => {})
      fs.writeSync(fd, `${index} `)
    }
    console.timeEnd("callbackWriteToFile")
  })

}

// callbackWriteToFile()

const streamWriteToFile = async () => {
  console.time("streamWriteToFile")

  const file = await fspromises.open("test.txt", "w")
  const writeStream = file.createWriteStream()

  for (let index = 0; index < 100000; index++) {
    const buff = Buffer.from(`${index} `, 'utf-8')
    writeStream.write(buff)
  }

  console.timeEnd("streamWriteToFile")
}

streamWriteToFile()