import { createWorker } from 'tesseract.js';
import { ReceiptItem } from '@/components/ReceiptScanner';

export class OCRProcessor {
  static async extractItems(imageFile: File): Promise<ReceiptItem[]> {
    const worker = await createWorker('deu'); // German language for REWE receipts
    
    try {
      const { data: { text } } = await worker.recognize(imageFile);
      return this.parseReceiptText(text);
    } finally {
      await worker.terminate();
    }
  }

  private static parseReceiptText(text: string): ReceiptItem[] {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const items: ReceiptItem[] = [];
    
    // Pattern to match item lines with prices (e.g., "KOERNER BALANCE EUR 2,49 B")
    const itemPattern = /^(.+?)\s+(EUR|€)?\s*(\d+[,\.]\d{2})\s*[AB]?\s*[\*]?$/i;
    
    // Pattern for alternative format (e.g., "PFAND 0,25 EURO 0,25 A *")
    const altPattern = /^(.+?)\s+(\d+[,\.]\d{2})\s+(EUR|EURO)\s+(\d+[,\.]\d{2})\s*[AB]?\s*[\*]?$/i;
    
    let itemId = 1;
    
    for (const line of lines) {
      // Skip header lines, totals, and footer
      if (this.shouldSkipLine(line)) {
        continue;
      }
      
      let match = line.match(itemPattern);
      let description = '';
      let priceStr = '';
      
      if (match) {
        description = match[1].trim();
        priceStr = match[3];
      } else {
        // Try alternative pattern
        match = line.match(altPattern);
        if (match) {
          description = match[1].trim();
          priceStr = match[4]; // Use the second price value
        }
      }
      
      if (description && priceStr) {
        // Clean up description
        description = this.cleanDescription(description);
        
        // Convert price string to number
        const price = parseFloat(priceStr.replace(',', '.'));
        
        if (price > 0 && description.length > 2) {
          items.push({
            id: `item-${itemId++}`,
            description,
            price
          });
        }
      }
    }
    
    return items;
  }
  
  private static shouldSkipLine(line: string): boolean {
    const skipPatterns = [
      /^REWE/i,
      /^Markt/i,
      /^Kurfürstendamm/i,
      /^Berlin/i,
      /^UID/i,
      /^SUMME/i,
      /^Geg\./i,
      /^EC-Cash/i,
      /^Datum:/i,
      /^Uhrzeit:/i,
      /^Beleg-Nr/i,
      /^Trace-Nr/i,
      /^Kartenzahlung/i,
      /^Contactless/i,
      /^girocard/i,
      /^Nr\./i,
      /^Terminal-ID/i,
      /^Pos-Info/i,
      /^AS-Zeit/i,
      /^Betrag EUR/i,
      /^Zahlung erfolgt/i,
      /^Steuer/i,
      /^TSE-/i,
      /^Seriennummer/i,
      /^Markt:/i,
      /^Kasse:/i,
      /^Bed\.:/i,
      /^\*+$/,
      /^=+$/,
      /^-+$/,
      /Entdecke und aktiviere/i,
      /Bonus-Vorteile/i,
      /Einfach beim/i,
      /Sammle noch mehr/i,
      /Coupons/i,
      /Keine Rabatte/i,
      /gekennzeichnete Produkte/i,
      /Vielen Dank/i,
      /^\d{2}\.\d{2}\.\d{4}$/,
      /^\d{2}:\d{2}$/
    ];
    
    return skipPatterns.some(pattern => pattern.test(line));
  }
  
  private static cleanDescription(description: string): string {
    // Remove common prefixes/suffixes that might be OCR artifacts
    return description
      .replace(/^(EUR|€)\s*/i, '')
      .replace(/\s*(EUR|€)$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }
}