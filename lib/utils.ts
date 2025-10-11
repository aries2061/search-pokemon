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
    
    // Create an Image element to load the image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        try {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
          
          // Get the image data as a blob with reduced quality (40%)
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg', 
              0.4  // 40% quality
            );
          });
          
          // Convert to base64 for storage
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image from ${imageUrl}`));
      };
      
      // Set the source to use the proxied URL
      img.src = proxiedImageUrl;
    })
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
