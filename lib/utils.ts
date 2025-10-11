import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from "browser-image-compression"
import ColorThief from "colorthief"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getDominantColor(
  imageUrl: string | undefined,
  alpha: number = 0.3
): Promise<string> {
  if (!imageUrl) return `rgba(200, 200, 200, ${alpha})`
  
  // Check if the image URL is from pokemondb.net which has CORS issues
  if (imageUrl.includes('pokemondb.net')) {
    console.warn(`Skipping color extraction for CORS-restricted image: ${imageUrl}`)
    return `rgba(200, 200, 200, ${alpha})`
  }
  
  return new Promise((resolve) => {
    const img = new Image()
    
    // Set up timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn(`Image loading timeout for ${imageUrl}`)
      resolve(`rgba(200, 200, 200, ${alpha})`)
    }, 5000) // Reduced to 5 second timeout
    
    img.onload = () => {
      clearTimeout(timeout)
      
      // Wait a bit to ensure the image is fully rendered
      setTimeout(() => {
        try {
          // Check if image has valid dimensions
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            console.warn(`Image has invalid dimensions: ${imageUrl}`)
            resolve(`rgba(200, 200, 200, ${alpha})`)
            return
          }
          
          const colorThief = new ColorThief()
          const dominantColor = colorThief.getColor(img)
          
          if (dominantColor && Array.isArray(dominantColor) && dominantColor.length === 3) {
            const [r, g, b] = dominantColor
            // Validate RGB values
            if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number' &&
                r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
              resolve(`rgba(${r}, ${g}, ${b}, ${alpha})`)
              return
            }
          }
          
          console.warn(`Invalid color data extracted from ${imageUrl}`)
          resolve(`rgba(200, 200, 200, ${alpha})`)
        } catch (error) {
          console.error('Error extracting dominant color:', error)
          resolve(`rgba(200, 200, 200, ${alpha})`)
        }
      }, 100) // Small delay to ensure image is rendered
    }
    
    img.onerror = (error) => {
      clearTimeout(timeout)
      console.warn(`Failed to load image at ${imageUrl}:`, error)
      resolve(`rgba(200, 200, 200, ${alpha})`)
    }
    
    // Try different CORS settings
    try {
      img.crossOrigin = "anonymous"
      img.src = imageUrl
    } catch (error) {
      clearTimeout(timeout)
      console.error('Error setting image source:', error)
      resolve(`rgba(200, 200, 200, ${alpha})`)
    }
  })
}


// export async function getDominantColor(
//   imageUrl: string | undefined,
//   alpha: number = 0.3
// ): Promise<string> {
//   if (!imageUrl) return `rgba(200, 200, 200, ${alpha})`
  
//   return new Promise((resolve) => {
//     const img = new Image()
//     img.crossOrigin = "Anonymous"
//     img.onload = () => {
//       try {
//         const colorThief = new ColorThief()
//         const dominantColor = colorThief.getColor(img)
        
//         if (dominantColor && dominantColor.length === 3) {
//           const [r, g, b] = dominantColor
//           resolve(`rgba(${r}, ${g}, ${b}, ${alpha})`)
//         } else {
//           resolve(`rgba(200, 200, 200, ${alpha})`)
//         }
//       } catch (error) {
//         console.error('Error extracting dominant color:', error)
//         resolve(`rgba(200, 200, 200, ${alpha})`)
//       }
//     }
    
//     img.onerror = () => {
//       resolve(`rgba(200, 200, 200, ${alpha})`)
//     }
    
//     img.src = imageUrl
//   })
// }

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
