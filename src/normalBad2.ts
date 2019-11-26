import { Readable, Writable, Transform } from "stream";
interface IChunk {
    value:number;
}

const readStream = new Readable({objectMode:true, read(){
    // Generate some data
}});

const writeStream = new Writable({objectMode:true, write(chunk:IChunk, encoding:string, cb:(err?:Error)=> void){
 // do some IO thing ?!
    cb();
    
}})

readStream.on("data", (data:IChunk) => {
    const newdata= {value:data.value+2};
    if (!writeStream.write(newdata)) {
        readStream.pause();
        writeStream.once("drain", ()=> {
            readStream.resume(); 
        })
    }
  
});
readStream.on("end",()=> {
    writeStream.end();
})

readStream.push({value:1});
readStream.push(null);





