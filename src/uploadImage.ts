import { type MultipartFile } from '@fastify/multipart'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createWriteStream, writeFile } from 'node:fs'
import { createWorker } from 'tesseract.js'
import bufferify from 'json-bufferify';

export async function uploadImage(file: MultipartFile | undefined, pump) {
  if (file === undefined) return { message: 'there is no file' }

  await pump(file.file, createWriteStream(`./.uploads/${file.filename}`))
  const worker = await createWorker('spa', 3, {
    logger: (logs) => {
      console.log(logs)
    }
  });
  const data = await worker.recognize(`./.uploads/${file.filename}`)

  const par = data.data.paragraphs.map(({ bbox, text }) => ({ bbox, text }))
  const words = data.data.words.map(({ bbox, text }) => ({ bbox, text }))
  const returnData = {
    text: data.data.text,
    words,
    par,
    radians: data.data.rotateRadians,
    // blocks: data.data.blocks
  }

  console.log(returnData.words[0], returnData.radians)
  return { message: 'files uploaded', returnData }
}