const fs = require("fs")

const basicFileRead = async () => {
  // default highwatermark (buffer size) for readstream in 64kB
  const readStream = fs.createReadStream("../src.txt")

  readStream.on("data", (chunk) => {
    const numbers = chunk.toString().split(" ")
    console.log(numbers);
  })

  readStream.on("end", () => {
    console.log("end called");
    readStream.close()
  })
}

basicFileRead()

const basicReadWrite = async () => {
  const readStream = fs.createReadStream("../src.txt")
  const writeStream = fs.createWriteStream("../dest2.txt")

  console.time("basicReadWrite")

  writeStream.on("drain", () => {
    console.log("drain called");
    readStream.resume()
  })

  readStream.on("data", (chunk) => {
    if (!writeStream.write(chunk)) {
      readStream.pause()
    }
  })

  readStream.on("end", () => {
    console.timeEnd("basicReadWrite")
  })
}

// basicReadWrite()
