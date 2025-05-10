import html2canvas from 'html2canvas';

/**
 * Captures a screenshot of the specified element and copies it to clipboard
 * @param elementRef The reference to the DOM element to screenshot
 * @returns Promise that resolves when screenshot is copied to clipboard
 */
export const captureScreenshot = async (elementRef: HTMLElement): Promise<void> => {
  if (!elementRef) return;
  
  try {
    // Add screenshot effect
    elementRef.classList.add('screenshot-flash');
    
    // Capture the element as canvas
    const canvas = await html2canvas(elementRef, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
    });

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Try to use different clipboard methods depending on browser support
    try {
      // Modern clipboard API (works on most desktop browsers)
      if (navigator.clipboard && navigator.clipboard.write && !isIOS) {
        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/png', 1.0);
        });

        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
      } 
      // Fallback for mobile devices - direct download approach
      else {
        // Get the data URL of the canvas
        const dataUrl = canvas.toDataURL('image/png');
        
        // iOS specific handling - create a direct download link
        if (isIOS) {
          // For iOS, we'll create a temporary link and trigger a download
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'random-wtf-result.png';
          
          // iOS requires the link to be in the DOM and visible
          link.style.position = 'fixed';
          link.style.top = '0';
          link.style.opacity = '0';
          link.style.pointerEvents = 'none';
          link.style.zIndex = '-1';
          
          document.body.appendChild(link);
          link.click();
          
          // Remove after a delay
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
          
          return;
        }
        
        // For Android and other devices
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // Let user know what's happening
          await navigator.clipboard.writeText("Screenshot saved! Check your downloads folder.");
        }
        
        // Create a download link for all mobile devices
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'random-wtf-result.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (clipboardError) {
      console.error('Clipboard API failed, falling back to download:', clipboardError);
      // Final fallback - just trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'random-wtf-result.png';
      document.body.appendChild(link);
      link.click();
      
      // Ensure link is removed on iOS
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
    }

    // Remove screenshot effect after a delay
    setTimeout(() => {
      elementRef.classList.remove('screenshot-flash');
    }, 300);

    return;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw new Error('Failed to capture screenshot');
  }
}; 