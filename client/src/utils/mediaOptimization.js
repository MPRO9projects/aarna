const IMAGE_MAX_DIMENSION = 1920;
const IMAGE_QUALITY = 0.82;

const readImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
        image,
        url,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read image file.'));
    };

    image.src = url;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to optimize image.'));
        return;
      }

      resolve(blob);
    }, type, quality);
  });

export const optimizeImageFile = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  if (file.type === 'image/gif') {
    return file;
  }

  const { width, height, image, url } = await readImageDimensions(file);
  const largestSide = Math.max(width, height);
  const shouldResize = largestSide > IMAGE_MAX_DIMENSION;
  const targetType =
    file.type === 'image/png' || file.type === 'image/webp'
      ? file.type
      : 'image/jpeg';

  if (!shouldResize && file.size < 900 * 1024) {
    URL.revokeObjectURL(url);
    return file;
  }

  const scale = shouldResize ? IMAGE_MAX_DIMENSION / largestSide : 1;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d', {
    alpha: targetType === 'image/png' || targetType === 'image/webp',
  });
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await canvasToBlob(canvas, targetType, IMAGE_QUALITY);
  URL.revokeObjectURL(url);

  const fileName =
    targetType === 'image/jpeg'
      ? file.name.replace(/\.[^.]+$/, '.jpg')
      : targetType === 'image/webp'
        ? file.name.replace(/\.[^.]+$/, '.webp')
        : file.name;

  return new File([blob], fileName, {
    type: blob.type || targetType,
    lastModified: Date.now(),
  });
};