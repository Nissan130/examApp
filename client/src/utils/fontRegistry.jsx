// utils/fontRegistry.js
import { Font } from '@react-pdf/renderer';

export const registerFont = async (familyName, sources) => {
  try {
    // Register each font variant
    for (const [style, src] of Object.entries(sources)) {
      Font.register({
        family: familyName,
        src: src,
        fontWeight: style === 'bold' ? 'bold' : 'normal',
        fontStyle: style === 'italic' ? 'italic' : 'normal',
      });
    }
    
    // Wait for fonts to load
    await Font.load({ family: familyName });
    return true;
  } catch (error) {
    console.error(`Failed to register font ${familyName}:`, error);
    return false;
  }
};