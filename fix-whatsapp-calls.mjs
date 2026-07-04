import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace: this.sendMessage(to, message, 'text'|'template', true|false, 'category') 
  // with: this.sendMessage(to, message, 'text'|'template', 'category')
  const regex = /(sendMessage\([^,]+,\s*[^,]+,\s*(?:'[^']+'|"[^"]+"),\s*)(?:true|false)(\s*(?:,|\)))/g;
  
  let newContent = content.replace(regex, (match, prefix, suffix) => {
    // If the suffix is just a closing parenthesis and there's a comma before it, we'd need to handle that.
    // However, the signature is sendMessage(to, msg, type, category). If it was sendMessage(to, msg, type, true), 
    // replacing true with nothing would leave a trailing comma. 
    // Let's just do a simple replacement for ", true, " -> ", " and ", false, " -> ", "
    return match; // fallback
  });
  
  // A safer manual replacement for true/false as the 4th argument:
  // We can just use String replace on the whole file.
  newContent = content.replace(/,\s*(?:true|false)\s*,/g, ',');
  
  // What if it's the last argument? sendMessage(to, msg, 'type', true) -> sendMessage(to, msg, 'type')
  newContent = newContent.replace(/,\s*(?:true|false)\s*\)/g, ')');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed:', filePath);
  } else {
    console.log('No changes needed in:', filePath);
  }
}

fixFile(path.resolve('src/lib/whatsapp-service.ts'));
