-- Fix security warnings by setting search_path for functions
ALTER FUNCTION search_ebooks(text) SET search_path = public;