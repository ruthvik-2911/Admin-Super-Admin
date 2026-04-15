const fs=require('fs');
const p=require('path');
function f(d){
    const files=fs.readdirSync(d);
    for(const file of files){
        const fp=p.join(d,file);
        if(fs.statSync(fp).isDirectory()){
            f(fp);
        } else if(fp.endsWith('.tsx')){
            let c=fs.readFileSync(fp,'utf8');
            let o=c;
            c=c.replace(/\{\/\*\s*Header\s*\*\/\}\r?\n\s*<header[\s\S]*?<\/header>/g,'');
            c=c.replace(/<header[\s\S]*?className="sticky top-0 z-40[\s\S]*?<\/header>/g, '');
            if(o!==c){
                fs.writeFileSync(fp,c);
                console.log('Fixed:',fp);
            }
        }
    }
}
f('src/pages/admin');
