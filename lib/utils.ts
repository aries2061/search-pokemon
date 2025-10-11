import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from "browser-image-compression"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getDominantColor(
  imageUrl: string | undefined,
  alpha: number = 0.3
): Promise<string> {
  if (!imageUrl) return `rgba(200, 200, 200, ${alpha})`
  
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0, img.width, img.height)
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data
      if (!imageData) {
        resolve(`rgba(200, 200, 200, ${alpha})`)
        return
      }
      
      let r = 0, g = 0, b = 0, count = 0
      
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i]
        g += imageData[i + 1]
        b += imageData[i + 2]
        count++
      }
      
      r = Math.floor(r / count)
      g = Math.floor(g / count)
      b = Math.floor(b / count)
      
      resolve(`rgba(${r}, ${g}, ${b}, ${alpha})`)
    }
    
    img.onerror = () => {
      resolve(`rgba(200, 200, 200, ${alpha})`)
    }
    
    img.src = imageUrl
  })
}

export async function downloadAndCompressImage(imageUrl: string, pokemonName: string): Promise<string> {
  try {
    // Use a CORS proxy to bypass CORS restrictions
    const corsProxyUrl = "https://corsproxy.io/?";
    const proxiedImageUrl = corsProxyUrl + encodeURIComponent(imageUrl);
    
    // Fetch the image as a blob
    const response = await fetch(proxiedImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    
    // Create a File object from the blob for imageCompression
    const imageFile = new File([imageBlob], `${pokemonName}.jpg`, { type: 'image/jpeg' });
    
    // Compression options
    const options = {
      maxSizeMB: 0.5, // Maximum file size in MB
      maxWidthOrHeight: 400, // Maximum width or height
      useWebWorker: true, // Use web worker for better performance
      quality: 0.4 // 40% quality
    };
    
    // Compress the image using imageCompression
    const compressedFile = await imageCompression(imageFile, options);
    
    // Convert compressed file to base64 for storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error("Error downloading/compressing image:", error)
    return ""
  }
}

export function useOnlineStatus() {
  if (typeof window === 'undefined') {
    return { isOnline: true, checkOnlineStatus: () => true };
  }
  
  const checkOnlineStatus = () => {
    return navigator.onLine;
  };
  
  return { 
    isOnline: checkOnlineStatus(),
    checkOnlineStatus
  };
}
