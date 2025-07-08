
-- Create junction table for ebook-category relationships
CREATE TABLE public.ebook_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(ebook_id, category_id)
);

-- Enable RLS on the junction table
ALTER TABLE public.ebook_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for ebook_categories
CREATE POLICY "Anyone can view ebook categories" 
ON public.ebook_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their ebook categories" 
ON public.ebook_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.ebooks 
    WHERE ebooks.id = ebook_categories.ebook_id 
    AND ebooks.uploaded_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage all ebook categories" 
ON public.ebook_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create index for better performance
CREATE INDEX idx_ebook_categories_ebook_id ON public.ebook_categories(ebook_id);
CREATE INDEX idx_ebook_categories_category_id ON public.ebook_categories(category_id);
