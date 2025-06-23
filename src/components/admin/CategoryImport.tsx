
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Plus } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";
import { useToast } from "@/hooks/use-toast";

const CategoryImport = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { useCreateCategory } = useEbooks();
  const createMutation = useCreateCategory();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    let categories: Array<{name: string, description?: string}> = [];

    try {
      if (file.name.endsWith('.csv')) {
        // Parse CSV - expecting format: name,description
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].toLowerCase().split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values[0] && values[0].trim()) {
            categories.push({
              name: values[0].trim(),
              description: values[1] ? values[1].trim() : undefined
            });
          }
        }
      } else if (file.name.endsWith('.json')) {
        categories = JSON.parse(text);
      }

      await processBulkCategories(categories);
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to parse the file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleJsonImport = async () => {
    try {
      const categories = JSON.parse(jsonText);
      await processBulkCategories(categories);
    } catch (error) {
      toast({
        title: "JSON Error",
        description: "Invalid JSON format. Please check your data.",
        variant: "destructive",
      });
    }
  };

  const handleBulkText = async () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const categories = lines.map(line => {
      const parts = line.split('|');
      return {
        name: parts[0].trim(),
        description: parts[1] ? parts[1].trim() : undefined
      };
    }).filter(cat => cat.name);

    await processBulkCategories(categories);
  };

  const processBulkCategories = async (categories: Array<{name: string, description?: string}>) => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const category of categories) {
      try {
        await new Promise((resolve, reject) => {
          createMutation.mutate(category, {
            onSuccess: () => {
              successCount++;
              resolve(true);
            },
            onError: (error) => {
              console.error(`Failed to create category ${category.name}:`, error);
              errorCount++;
              resolve(true); // Continue with next category
            },
          });
        });
      } catch (error) {
        errorCount++;
      }
    }

    setIsProcessing(false);
    setIsDialogOpen(false);
    setCsvFile(null);
    setJsonText("");
    setBulkText("");

    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} categories. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Categories</DialogTitle>
          <DialogDescription>
            Import multiple categories at once using different methods.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="json">JSON Data</TabsTrigger>
            <TabsTrigger value="text">Bulk Text</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Upload File
                </CardTitle>
                <CardDescription>
                  Upload a CSV or JSON file with category data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryFile">Select File</Label>
                  <Input
                    id="categoryFile"
                    type="file"
                    accept=".csv,.json"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>CSV Format:</strong> name,description</p>
                  <p className="font-mono text-xs bg-muted p-2 rounded">
                    Technology,Books about technology and programming<br/>
                    Science,Scientific literature and research<br/>
                    Fiction,Novels and fictional stories
                  </p>
                  
                  <p><strong>JSON Format:</strong></p>
                  <p className="font-mono text-xs bg-muted p-2 rounded">
                    {`[
  {"name": "Technology", "description": "Books about technology"},
  {"name": "Science", "description": "Scientific literature"}
]`}
                  </p>
                </div>

                <Button 
                  onClick={() => csvFile && handleFileUpload(csvFile)}
                  disabled={!csvFile || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Import from File"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>JSON Data</CardTitle>
                <CardDescription>
                  Paste your category data in JSON format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jsonData">JSON Data</Label>
                  <Textarea
                    id="jsonData"
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder={`[
  {"name": "Technology", "description": "Books about technology"},
  {"name": "Science", "description": "Scientific literature"}
]`}
                    rows={8}
                  />
                </div>
                
                <Button 
                  onClick={handleJsonImport}
                  disabled={!jsonText.trim() || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Import from JSON"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Text</CardTitle>
                <CardDescription>
                  Enter categories one per line. Use | to separate name and description.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulkText">Categories (one per line)</Label>
                  <Textarea
                    id="bulkText"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Technology | Books about technology and programming
Science | Scientific literature and research
Fiction | Novels and fictional stories
Business
Health | Health and wellness guides"
                    rows={8}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p><strong>Format:</strong> Category Name | Description (optional)</p>
                  <p>If no description is provided, only the category name will be used.</p>
                </div>
                
                <Button 
                  onClick={handleBulkText}
                  disabled={!bulkText.trim() || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Import Categories"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryImport;
