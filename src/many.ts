import { Readable, Writable, Transform, pipeline, PassThrough } from "stream";
interface IChunk {
    value:number;
}

const writeStream = new Writable({objectMode:true, write(chunk:IChunk, encoding:string, cb:(err?:Error)=> void){
    // do some IO thing ?!
    cb();
}})

const mainLine= new PassThrough({objectMode:true});

// While something create a new source stream, here in this example we just unroll the loop
const source1 = new Readable({objectMode:true, read(){
    // Generate some data
}});
const source2 = new Readable({objectMode:true, read(){
    // Generate some data
}});

// connect the source stream to the mainLine
source1.pipe(mainLine, {end:false});
source2.pipe(mainLine, {end:false});

// handle error propagation
source1.on("error", (err)=> {
    mainLine.destroy(err);
});
source2.on("error", (err)=> {
    mainLine.destroy(err);
});
mainLine.on("error", (err)=> {
    source1.destroy(err);
});
mainLine.on("error", (err)=> {
    source2.destroy(err);
});

const transformStream = new Transform({objectMode:true,transform(chunk:IChunk, encoding:string, cb:()=>void){
    this.push({value:chunk.value+2});
    cb();
}})

pipeline(mainLine, transformStream, writeStream, err => {
    if (err) {
        // Error Handle
    }
})

source1.push({value:1});
source1.push(null);
source2.push({value:1});
source2.push(null);

// when some condition fullfilles we break the while loop and end the mainLine.
mainLine.end();