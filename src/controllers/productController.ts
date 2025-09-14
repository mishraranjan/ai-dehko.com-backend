import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const options = req.query as any;  // e.g., { category: 'Marketing', tags: 'automation', sort: 'popularity' }
      const products = await ProductService.getAll(options);
      res.json({ products, total: products.length });  // Add pagination count later
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const product = await ProductService.getById(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ProductService.delete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // PRD: Compare
  static async compare(req: Request, res: Response) {
    try {
      const { ids } = req.body;  // e.g., ['id1', 'id2']
      const products = await ProductService.compare(ids);
      res.json({ products });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PRD: Trending/Widgets
  static async trending(req: Request, res: Response) {
    try {
      const { category, limit = 5 } = req.query as any;
      const products = await ProductService.getTrending(category, Number(limit));
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PRD: Add review
  static async addReview(req: Request, res: Response) {
    try {
      const { user, rating, comment } = req.body;
      const product = await ProductService.addReview(req.params.id, { user, rating, comment });
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}