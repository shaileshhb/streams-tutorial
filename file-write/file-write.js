const fspromises = require("fs/promises")
const fs = require("fs")

const slowestWriteToFile = async () => {
  console.time("slowestWriteToFile")
  const file = await fspromises.open("../src.txt", "w")

  for (let index = 0; index < 100000; index++) {
    await file.write(`${index} `)
  }

  console.timeEnd("slowestWriteToFile")
}

// slowestWriteToFile()

const callbackWriteToFile = async () => {
  console.time("callbackWriteToFile")
  fs.open("../src.txt", "w", async (err, fd) => {
    if (err) {
      console.log(err);
      return
    }

    // this will run into javascript heap out of memory because callback functions are stored in event loop which goes out of memory
    // for (let index = 0; index < 10000000; index++) {
    //   fs.write(fd, `${index} `, () => {})
    // }

    for (let index = 0; index < 10000000; index++) {
      fs.writeSync(fd, `${index} `)
    }
    console.timeEnd("callbackWriteToFile")
  })

}

// callbackWriteToFile()

const streamWriteToFile = async () => {
  console.time("streamWriteToFile")

  const file = await fspromises.open("../src.txt", "w")
  const writeStream = file.createWriteStream()

  fs.createWriteStream("../src.txt", {highWaterMark: 400})

  for (let index = 0; index < 100000; index++) {
    const buff = Buffer.from(`${index} `, 'utf-8')
    writeStream.write(buff)
  }

  console.timeEnd("streamWriteToFile")
}

// streamWriteToFile()

const streamWriteToFile2 = async () => {
  console.time("streamWriteToFile2")

  const file = await fspromises.open("../src.txt", "w")
  const writeStream = file.createWriteStream()

  let i = 0
  let MAX_WRITE = 10000000

  const writeToFile = () => {

    while (i < MAX_WRITE) {
      const buff = Buffer.from(`${i} `, 'utf-8')

      if (i === MAX_WRITE - 1) {
        return writeStream.end(buff)
      }

      const isWrite = writeStream.write(buff)
      
      if (!isWrite) break
      i++
    }
  }

  writeToFile()

  writeStream.on("drain", () => {
    console.log("Draining");
    writeToFile()
  })

  
  writeStream.on("finish", () => {
    console.timeEnd("streamWriteToFile2")
    writeStream.close()
  })

}

streamWriteToFile2()
