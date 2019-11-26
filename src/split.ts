import { Readable, Writable, Transform, pipeline, PassThrough } from "stream";
interface IChunk {
    value:number;
}
const readStream = new Readable({objectMode:true, read(){
    // Generate some data
}});

const writeStreamLeft = new Writable({objectMode:true, write(chunk:IChunk, encoding:string, cb:(err?:Error)=> void){
    // do some IO thing ?!
    cb();
}})

const writeStreamRight = new Writable({objectMode:true, write(chunk:IChunk, encoding:string, cb:(err?:Error)=> void){
    // do some IO other thing ?!
    cb();
}})

const transformStreamLeft = new Transform({objectMode:true,transform(chunk:IChunk, encoding:string, cb:()=>void){
    this.push({value:chunk.value+2});
    cb();
}});
const transformStreamRight = new Transform({objectMode:true,transform(chunk:IChunk, encoding:string, cb:()=>void){
    this.push({value:chunk.value+2});
    cb();
}});

const leftStream= new PassThrough({objectMode:true});
const rightStream = new PassThrough({objectMode:true});
const leftSide=pipeline(readStream,  leftStream, err => {
    if (err) {
        // Error Handle
    }
});
const rightSide=pipeline(readStream,  rightStream, err => {
    if (err) {
        // Error Handle
    }
});

pipeline(leftSide, transformStreamLeft,writeStreamLeft);
pipeline(rightSide,transformStreamRight,writeStreamRight);

readStream.push({value:1});
readStream.push(null);