import { Readable, Writable, Transform, pipeline, PassThrough } from "stream";
interface IChunk {
    value:number;
}

const source1 = new Readable({objectMode:true, read(){
    // Generate some data
}});
const source2 = new Readable({objectMode:true, read(){
    // Generate some data
}});

const writeStream = new Writable({objectMode:true, write(chunk:IChunk, encoding:string, cb:(err?:Error)=> void){
    // do some IO thing ?!
    cb();
}});
const transformStream = new Transform({objectMode:true,transform(chunk:IChunk, encoding:string, cb:()=>void){
        
    this.push({value:chunk.value+2});
    cb();
}});

const joinend:PassThrough = [source1,source2].reduce(
    (pt :PassThrough, s:Readable & {ended?:boolean},i, a:Array<Readable & {ended?:boolean}>)=>{
s.pipe(pt, {end:false});
s.on("error",err=> {
    pt.destroy(err);
});
pt.on("error",err=> {
    s.destroy(err);
});
s.once("end",()=>{
    s.ended=true;
    if (a.every(element=> element.ended)) {
        pt.end();
    }
});
return pt;

}, new PassThrough({objectMode:true}));

pipeline(joinend, transformStream, writeStream, err => {
    if (err) {
        // Error Handle
    }
})

source1.push({value:1});
source1.push(null);
source2.push({value:1});
source2.push(null);

