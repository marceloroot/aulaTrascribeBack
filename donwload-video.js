import fs  from 'fs';
import  ytdl from 'ytdl-core';

export const donwloader=(videoid)=>new Promise((resolve, reject)=>{
    const videourl = "https://youtube.com/watch?v="+videoid;

    console.log('[Start donwlod]',videourl);

    ytdl(videourl,{
        quality:"lowestaudio",
        filter:"audioonly"
    }).on('end', ()=>{
        console.log('[Terminou_Download]');
        resolve()
    }).on('error',(err)=>{
        console.log("Error",err);
        reject('[Error_Downloading_Video]');
    }).pipe(fs.createWriteStream(`${videoid}.mp4`));
   
})