/**
 * Script para optimizar imágenes del proyecto
 * Ejecutar con: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = './public';
const BACKUP_DIR = './public/backup';

// Imágenes a optimizar con configuración específica
const optimizations = [
  {
    input: 'FifaBall.png',
    output: 'FifaBall.png',
    options: { width: 192, height: 192 }, // Favicon size
    format: 'png',
    quality: 80
  },
  {
    input: 'NEXOS_Curva.png',
    output: 'NEXOS_Curva.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'nova-logo.png',
    output: 'nova-logo.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'PARTNERS.png',
    output: 'PARTNERS.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'OE_Logo.png',
    output: 'OE_Logo.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'forma-spie1.png',
    output: 'forma-spie1.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'NEXOS.png',
    output: 'NEXOS.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'spie-logo.png',
    output: 'spie-logo.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'NEXOS_Cordon.png',
    output: 'NEXOS_Cordon.webp',
    options: {},
    format: 'webp',
    quality: 80
  },
  {
    input: 'forma-spie2.png',
    output: 'forma-spie2.webp',
    options: {},
    format: 'webp',
    quality: 80
  }
];

async function optimizeImages() {
  console.log('🚀 Iniciando optimización de imágenes...\n');

  // Crear directorio de backup si no existe
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
  } catch (e) {
    // Directorio ya existe
  }

  for (const opt of optimizations) {
    const inputPath = join(PUBLIC_DIR, opt.input);
    const outputPath = join(PUBLIC_DIR, opt.output);
    const backupPath = join(BACKUP_DIR, opt.input);

    try {
      // Verificar que el archivo existe
      const inputStat = await stat(inputPath);
      const inputSizeKB = (inputStat.size / 1024).toFixed(2);

      console.log(`📁 Procesando: ${opt.input} (${inputSizeKB} KB)`);

      // Crear backup del original
      await sharp(inputPath).toFile(backupPath);

      // Procesar imagen
      let pipeline = sharp(inputPath);

      if (opt.options.width || opt.options.height) {
        pipeline = pipeline.resize(opt.options.width, opt.options.height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        });
      }

      if (opt.format === 'webp') {
        pipeline = pipeline.webp({ quality: opt.quality });
      } else if (opt.format === 'png') {
        pipeline = pipeline.png({ quality: opt.quality, compressionLevel: 9 });
      }

      await pipeline.toFile(outputPath + '.tmp');

      // Renombrar temp a final
      const { rename } = await import('fs/promises');
      await rename(outputPath + '.tmp', outputPath);

      // Verificar tamaño final
      const outputStat = await stat(outputPath);
      const outputSizeKB = (outputStat.size / 1024).toFixed(2);
      const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);

      console.log(`   ✅ Optimizado: ${opt.output} (${outputSizeKB} KB) - Reducción: ${reduction}%\n`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('✨ Optimización completada!');
  console.log(`📂 Backups guardados en: ${BACKUP_DIR}`);
}

optimizeImages();
