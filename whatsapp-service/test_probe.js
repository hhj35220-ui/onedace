const cp=require('child_process');const http=require('http');
const child=cp.spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3001'}});
let ready=false;
function req(method,path,headers={}){
  return new Promise((resolve,reject)=>{
    const r=http.request({host:'127.0.0.1',port:3001,path,method,headers},res=>{
      let d='';
      res.on('data',c=>d+=c);
      res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:d}));
    });
    r.on('error',reject);
    r.end();
  });
}
child.stdout.on('data',async b=>{
  const t=b.toString();
  console.log('STDOUT:', t);
  if(ready)return;
  if(t.includes('OnePlace WhatsApp service listening')){
    ready=true;
    try{
      const h=await req('GET','/api/whatsapp/health');
      console.log('HEALTH_STATUS',h.status);
      console.log('HEALTH_BODY',h.body);
      const o=await req('OPTIONS','/api/whatsapp/health',{'Origin':'http://localhost:8000','Access-Control-Request-Method':'GET'});
      console.log('OPTIONS_STATUS',o.status);
      console.log('OPTIONS_ACAO',o.headers['access-control-allow-origin']||'');
      console.log('OPTIONS_ACAH',o.headers['access-control-allow-headers']||'');
      const root=await req('GET','/');
      console.log('ROOT_STATUS',root.status);
      console.log('ROOT_BODY',root.body.slice(0,80));
    }catch(e){
      console.log('PROBE_ERROR',e.message);
    }finally{
      child.kill('SIGTERM');
    }
  }
});
child.stderr.on('data', b=>{
  console.log('STDERR:', b.toString());
});
setTimeout(()=>{
  if(!ready){
    console.log('START_TIMEOUT');
    child.kill('SIGTERM');
  }
},20000);
