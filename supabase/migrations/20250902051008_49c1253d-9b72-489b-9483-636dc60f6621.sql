-- Add indexes for better search performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ebooks_search 
ON ebooks USING gin(to_tsvector('english', title || ' ' || author || ' ' || COALESCE(description, '')));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ebooks_category 
ON ebooks (category) WHERE status = 'approved';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ebooks_status_downloads 
ON ebooks (status, downloads DESC) WHERE status = 'approved';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ebooks_featured 
ON ebooks (is_featured, status) WHERE status = 'approved' AND is_featured = true;

-- Add function for full-text search
CREATE OR REPLACE FUNCTION search_ebooks(search_query text)
RETURNS TABLE (
  id uuid,
  title text,
  author text,
  description text,
  category text,
  file_url text,
  cover_image text,
  chapters integer,
  downloads integer,
  is_featured boolean,
  created_at timestamptz,
  rank real
) 
LANGUAGE sql STABLE
AS $$
  SELECT 
    e.id, e.title, e.author, e.description, e.category, 
    e.file_url, e.cover_image, e.chapters, e.downloads, 
    e.is_featured, e.created_at,
    ts_rank(to_tsvector('english', e.title || ' ' || e.author || ' ' || COALESCE(e.description, '')), plainto_tsquery('english', search_query)) as rank
  FROM ebooks e
  WHERE e.status = 'approved' 
    AND to_tsvector('english', e.title || ' ' || e.author || ' ' || COALESCE(e.description, '')) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, e.downloads DESC;
$$;