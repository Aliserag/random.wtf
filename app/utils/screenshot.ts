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

    // Try to use different clipboard methods depending on browser support
    try {
      // Modern clipboard API (works on most desktop browsers)
      if (navigator.clipboard && navigator.clipboard.write) {
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
      // Fallback for mobile devices - use dataURL and text copying
      else {
        // Get the data URL of the canvas
        const dataUrl = canvas.toDataURL('image/png');
        
        // For devices that support text clipboard but not image clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // Copy a message with the data URL
          await navigator.clipboard.writeText("Screenshot taken! You can save the image from the browser.");
          
          // Open the image in a new tab (mobile users can save from there)
          const tab = window.open();
          if (tab) {
            tab.document.write(`<img src="${dataUrl}" alt="Screenshot" style="max-width: 100%;" />`);
            tab.document.title = 'Random.wtf Screenshot';
            tab.document.close();
          }
        } else {
          // Last resort fallback - create a temporary link and click it
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'random-wtf-result.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (clipboardError) {
      console.error('Clipboard API failed, falling back to download:', clipboardError);
      // Final fallback - just trigger download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'random-wtf-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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