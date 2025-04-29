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

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png', 1.0);
    });

    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

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