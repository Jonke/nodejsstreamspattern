import { Readable, Writable, Transform, pipeline } from "stream";
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






const transformStream = new Transform({objectMode:true,transform(chunk:IChunk, encoding:string, cb:()=>void){
        
    this.push({value:chunk.value+2});
    cb();
}})

pipeline(readStream, transformStream, writeStream, err => {
    if (err) {
        // Error Handle
    }
})

readStream.push({value:1});
readStream.push(null);