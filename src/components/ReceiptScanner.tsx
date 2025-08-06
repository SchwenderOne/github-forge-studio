import { useState } from "react";
import { Upload, Scan, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OCRProcessor } from "@/services/OCRProcessor";
import { OCRResults } from "./OCRResults";
import { ItemSwiper } from "./ItemSwiper";
import { AllocationSummary } from "./AllocationSummary";

export interface ReceiptItem {
  id: string;
  description: string;
  price: number;
  category?: 'me' | 'roommate' | 'shared';
}

export interface AllocationResult {
  me: ReceiptItem[];
  roommate: ReceiptItem[];
  shared: ReceiptItem[];
  totals: {
    me: number;
    roommate: number;
    shared: number;
    myShare: number; // me + (shared/2)
    roommateShare: number; // roommate + (shared/2)
  };
}

interface ReceiptScannerProps {
  onComplete: (allocation: AllocationResult) => void;
  onCancel: () => void;
}

export const ReceiptScanner = ({ onComplete, onCancel }: ReceiptScannerProps) => {
  const [stage, setStage] = useState<'upload' | 'processing' | 'review' | 'swipe' | 'summary'>('upload');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [extractedItems, setExtractedItems] = useState<ReceiptItem[]>([]);
  const [allocationResult, setAllocationResult] = useState<AllocationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCRProcess = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setStage('processing');
    
    try {
      const items = await OCRProcessor.extractItems(uploadedImage);
      setExtractedItems(items);
      setStage('review');
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewComplete = (reviewedItems: ReceiptItem[]) => {
    setExtractedItems(reviewedItems);
    setStage('swipe');
  };

  const handleSwipeComplete = (allocation: AllocationResult) => {
    setAllocationResult(allocation);
    setStage('summary');
  };

  const handleFinalSubmit = () => {
    if (allocationResult) {
      onComplete(allocationResult);
    }
  };

  return (
    <div className="space-y-6">
      {stage === 'upload' && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-medium">Click to upload receipt</p>
                <p className="text-muted-foreground text-sm">PNG, JPG, JPEG up to 10MB</p>
              </label>
            </div>
            
            {imagePreview && (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Receipt preview" 
                  className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-soft"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={handleOCRProcess}
                    className="flex-1 bg-gradient-primary text-primary-foreground"
                    disabled={isProcessing}
                  >
                    <Scan className="mr-2 h-4 w-4" />
                    Scan Receipt
                  </Button>
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {stage === 'processing' && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Scanning receipt...</p>
            <p className="text-muted-foreground text-sm">This may take a few moments</p>
          </CardContent>
        </Card>
      )}

      {stage === 'review' && (
        <OCRResults 
          items={extractedItems}
          onComplete={handleReviewComplete}
          onCancel={onCancel}
        />
      )}

      {stage === 'swipe' && (
        <ItemSwiper 
          items={extractedItems}
          onComplete={handleSwipeComplete}
          onCancel={onCancel}
        />
      )}

      {stage === 'summary' && allocationResult && (
        <AllocationSummary 
          allocation={allocationResult}
          onConfirm={handleFinalSubmit}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};