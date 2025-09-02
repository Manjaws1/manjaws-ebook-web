import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Contrast, 
  Volume2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

const AccessibilityMenu: React.FC = () => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    if (readingMode) {
      document.documentElement.classList.add('reading-mode');
    } else {
      document.documentElement.classList.remove('reading-mode');
    }
  }, [fontSize, highContrast, reducedMotion, readingMode]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80));
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setReducedMotion(false);
    setReadingMode(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
          aria-label="Open accessibility menu"
        >
          <Accessibility className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Options
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Font Size Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current: {fontSize}%</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 80}
                    aria-label="Decrease font size"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    disabled={fontSize >= 150}
                    aria-label="Increase font size"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visual Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={highContrast ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setHighContrast(!highContrast)}
              >
                <Contrast className="w-4 h-4 mr-2" />
                High Contrast Mode
              </Button>
              
              <Button
                variant={reducedMotion ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setReducedMotion(!reducedMotion)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reduce Motion
              </Button>

              <Button
                variant={readingMode ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setReadingMode(!readingMode)}
              >
                <Type className="w-4 h-4 mr-2" />
                Reading Mode
              </Button>
            </CardContent>
          </Card>

          {/* Audio Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Audio Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => speakText("Screen reader support is available. Text-to-speech is now active.")}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Screen Reader
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilityMenu;