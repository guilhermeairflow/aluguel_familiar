/**
 * compress-images.js
 * Comprime todas as imagens da pasta /public sem limitar quantidade
 * Roda com: node scripts/compress-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = 75; // JPEG quality (75 = ótimo equilíbrio qualidade/tamanho)
const MAX_WIDTH = 1920; // Máximo de largura — suficiente para qualquer tela

const exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function compress() {
  const files = fs.readdirSync(PUBLIC_DIR).filter(f => exts.includes(path.extname(f)));
  
  console.log(`\n🗂️  ${files.length} imagens encontradas em /public\n`);
  
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(PUBLIC_DIR, file);
    const stat = fs.statSync(filePath);
    const sizeBefore = stat.size;
    totalBefore += sizeBefore;

    try {
      const buffer = await sharp(filePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
        .toBuffer();

      fs.writeFileSync(filePath, buffer);
      
      const sizeAfter = buffer.length;
      totalAfter += sizeAfter;
      const saved = Math.round((1 - sizeAfter / sizeBefore) * 100);
      
      console.log(`✅ ${file.padEnd(35)} ${(sizeBefore/1024/1024).toFixed(2)}MB → ${(sizeAfter/1024/1024).toFixed(2)}MB  (${saved}% menor)`);
    } catch (err) {
      console.log(`⚠️  ${file} — ignorado (${err.message})`);
      totalAfter += sizeBefore;
    }
  }

  console.log(`\n📊 TOTAL ANTES:  ${(totalBefore/1024/1024).toFixed(1)} MB`);
  console.log(`📊 TOTAL DEPOIS: ${(totalAfter/1024/1024).toFixed(1)} MB`);
  console.log(`🚀 ECONOMIA:     ${((totalBefore - totalAfter)/1024/1024).toFixed(1)} MB (${Math.round((1 - totalAfter/totalBefore)*100)}% menor)\n`);
}

compress().catch(console.error);
