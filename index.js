import express from 'express';
import cors from 'cors';
import { donwloader } from './donwload-video.js';
import { createMP3 } from './create-mp3.js';
import { Transcribe } from './transcribe.js';

const app = express();

app.use(cors());


app.get('/audio', async(req,res) =>{
    const videoId = req.query.v;
    try{
        console.log(videoId);
        //donwload
          await donwloader(videoId);
        //audio
        await createMP3(videoId);
        const data = await Transcribe(videoId);
        
        console.log(data)
        return res.status(201).send(data)
    }
    catch(error){
        return res.status(201).send(error)
    }
})

app.listen(3020,() => console.log('Server Ativo na porta 3020'))