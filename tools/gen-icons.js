// 图标生成脚本
// 用法: node tools/gen-icons.js
// 需要: npm install sharp (一次性)

const fs = require('fs');
const path = require('path');

const SVG = fs.readFileSync(path.join(__dirname, '..', 'icons', 'icon.svg'), 'utf8');
const ICONS_DIR = path.join(__dirname, '..', 'icons');

const sizes = [
  { name: 'icon-192.png', w: 192, h: 192 },
  { name: 'icon-512.png', w: 512, h: 512 },
  { name: 'icon-180.png', w: 180, h: 180 },
];

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('❌ 未安装 sharp 模块');
    console.log('   请先运行: npm install sharp');
    console.log('   或者用浏览器打开: tools/generate-icons.html');
    process.exit(1);
  }

  for (const { name, w, h } of sizes) {
    const filePath = path.join(ICONS_DIR, name);
    await sharp(Buffer.from(SVG)).resize(w, h).png().toFile(filePath);
    console.log(`✅ ${name} (${w}×${h})`);
  }

  // 也生成启动图
  const launchPath = path.join(__dirname, '..', 'screenshots', 'launch.png');
  await sharp({
    create: { width: 1179, height: 2556, channels: 3, background: '#000000' }
  }).png().toFile(launchPath);
  console.log('✅ launch.png (启动图)');
  console.log('\n🎉 所有图标生成完成！');
}

main().catch(console.error);
