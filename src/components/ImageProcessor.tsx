interface ProcessingOptions {
  scale: number;
  sharpen: number;
  denoise: number;
  contrast: number;
  brightness: number;
}

class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async enhanceImage(
    imageSrc: string, 
    options: ProcessingOptions,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          this.processImage(img, options, onProgress).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSrc;
    });
  }

  private async processImage(
    img: HTMLImageElement,
    options: ProcessingOptions,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const originalWidth = img.width;
    const originalHeight = img.height;
    const scaledWidth = Math.round(originalWidth * options.scale);
    const scaledHeight = Math.round(originalHeight * options.scale);

    // Step 1: Upscaling (20% progress)
    onProgress?.(10);
    const upscaledCanvas = this.upscaleImage(img, scaledWidth, scaledHeight);
    onProgress?.(30);

    // Step 2: Apply filters
    this.canvas.width = scaledWidth;
    this.canvas.height = scaledHeight;
    this.ctx.drawImage(upscaledCanvas, 0, 0);

    const imageData = this.ctx.getImageData(0, 0, scaledWidth, scaledHeight);
    let processedData = imageData;

    // Step 3: Noise reduction (40% progress)
    if (options.denoise > 0) {
      onProgress?.(40);
      processedData = this.applyDenoising(processedData, options.denoise);
    }

    // Step 4: Sharpening (60% progress)
    if (options.sharpen > 0) {
      onProgress?.(60);
      processedData = this.applySharpening(processedData, options.sharpen);
    }

    // Step 5: Contrast and brightness (80% progress)
    onProgress?.(80);
    processedData = this.adjustContrastBrightness(processedData, options.contrast, options.brightness);

    // Step 6: Final touches (100% progress)
    this.ctx.putImageData(processedData, 0, 0);
    onProgress?.(100);

    return this.canvas.toDataURL('image/png', 1.0);
  }

  private upscaleImage(img: HTMLImageElement, newWidth: number, newHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Use high-quality image scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Lanczos-like resampling using multiple passes for better quality
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Multi-pass scaling for better quality
    let currentWidth = img.width;
    let currentHeight = img.height;
    let currentCanvas = document.createElement('canvas');
    let currentCtx = currentCanvas.getContext('2d')!;
    
    currentCanvas.width = currentWidth;
    currentCanvas.height = currentHeight;
    currentCtx.drawImage(img, 0, 0);
    
    // Scale in steps for better quality
    while (currentWidth < newWidth * 0.5 || currentHeight < newHeight * 0.5) {
      const nextWidth = Math.min(currentWidth * 2, newWidth);
      const nextHeight = Math.min(currentHeight * 2, newHeight);
      
      tempCanvas.width = nextWidth;
      tempCanvas.height = nextHeight;
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(currentCanvas, 0, 0, nextWidth, nextHeight);
      
      currentCanvas.width = nextWidth;
      currentCanvas.height = nextHeight;
      currentCtx.drawImage(tempCanvas, 0, 0);
      
      currentWidth = nextWidth;
      currentHeight = nextHeight;
    }
    
    // Final scaling
    ctx.drawImage(currentCanvas, 0, 0, newWidth, newHeight);
    
    return canvas;
  }

  private applyDenoising(imageData: ImageData, strength: number): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    
    // Bilateral filter for noise reduction
    const radius = Math.ceil(strength * 3);
    const sigmaColor = strength * 50;
    const sigmaSpatial = radius * 0.5;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIdx = (y * width + x) * 4;
        const centerR = imageData.data[centerIdx];
        const centerG = imageData.data[centerIdx + 1];
        const centerB = imageData.data[centerIdx + 2];
        
        let totalWeight = 0;
        let sumR = 0, sumG = 0, sumB = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const neighborIdx = (ny * width + nx) * 4;
              const neighborR = imageData.data[neighborIdx];
              const neighborG = imageData.data[neighborIdx + 1];
              const neighborB = imageData.data[neighborIdx + 2];
              
              const spatialDist = Math.sqrt(dx * dx + dy * dy);
              const colorDist = Math.sqrt(
                Math.pow(neighborR - centerR, 2) +
                Math.pow(neighborG - centerG, 2) +
                Math.pow(neighborB - centerB, 2)
              );
              
              const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpatial * sigmaSpatial));
              const colorWeight = Math.exp(-(colorDist * colorDist) / (2 * sigmaColor * sigmaColor));
              const weight = spatialWeight * colorWeight;
              
              totalWeight += weight;
              sumR += neighborR * weight;
              sumG += neighborG * weight;
              sumB += neighborB * weight;
            }
          }
        }
        
        if (totalWeight > 0) {
          data[centerIdx] = Math.round(sumR / totalWeight);
          data[centerIdx + 1] = Math.round(sumG / totalWeight);
          data[centerIdx + 2] = Math.round(sumB / totalWeight);
          data[centerIdx + 3] = imageData.data[centerIdx + 3];
        }
      }
    }
    
    return new ImageData(data, width, height);
  }

  private applySharpening(imageData: ImageData, strength: number): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    
    // Unsharp masking
    const kernel = [
      0, -strength, 0,
      -strength, 1 + 4 * strength, -strength,
      0, -strength, 0
    ];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          let idx = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += imageData.data[pixelIdx] * kernel[idx++];
            }
          }
          
          const currentIdx = (y * width + x) * 4 + c;
          data[currentIdx] = Math.max(0, Math.min(255, sum));
        }
        
        // Keep alpha channel unchanged
        const currentIdx = (y * width + x) * 4 + 3;
        data[currentIdx] = imageData.data[currentIdx];
      }
    }
    
    return new ImageData(data, width, height);
  }

  private adjustContrastBrightness(imageData: ImageData, contrast: number, brightness: number): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness and contrast to RGB channels
      for (let c = 0; c < 3; c++) {
        let pixel = data[i + c];
        
        // Apply brightness
        pixel += brightness * 255;
        
        // Apply contrast
        pixel = factor * (pixel - 128) + 128;
        
        // Clamp values
        data[i + c] = Math.max(0, Math.min(255, pixel));
      }
      
      // Keep alpha channel unchanged
      data[i + 3] = imageData.data[i + 3];
    }
    
    return new ImageData(data, imageData.width, imageData.height);
  }
}

export default ImageProcessor;