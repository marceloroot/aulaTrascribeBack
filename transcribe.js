global.self = global;

import { pipeline, env } from '@xenova/transformers'
import wavefile from 'wavefile';
import { AutoProcessor, read_audio } from '@xenova/transformers';
import fs from 'fs';
// 2. Disable spawning worker threads for testing.
// This is done by setting numThreads to 1

env.backends.onnx.wasm.numThreads = 1
export const Transcribe = async (videoId) =>{
    try{
     const options={
      chunk_length_s:30,
      stride_length_s:5,
      language:'portuguese',
      task:'transcribe',
      return_timestamps:true

     } ;
     const transcriber = await pipeline('automatic-speech-recognition','Xenova/whisper-small');
     
// Load audio data
//let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
//let buffer = Buffer.from(await fetch(url).then(x => x.arrayBuffer()))
const buffer = fs.readFileSync(`${videoId}.wav`);
// Read .wav file and convert it to required format
let wav = new wavefile.WaveFile(buffer);
wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
let audioData = wav.getSamples();
if (Array.isArray(audioData)) {
  if (audioData.length > 1) {
    const SCALING_FACTOR = Math.sqrt(2);

    // Merge channels (into first channel to save memory)
    for (let i = 0; i < audioData[0].length; ++i) {
      audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
    }
  }

  // Select first channel
  audioData = audioData[0];
}
let start = performance.now();
let output = await transcriber(audioData,options);
let end = performance.now();
console.log(`Execution duration: ${(end - start) / 1000} seconds`);
console.log(output);
fs.unlink(`${videoId}.wav`, (err) => {
    if (err) {
      console.error('Ocorreu um erro ao excluir o arquivo:', err);
      return;
    }
  
    console.log('O arquivo foi excluído com sucesso!');
  });
     return output;
    }
    catch(error){
        console.log(error)
    }
    
}