import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const options = req.query as any;
      const products = await ProductService.getAll(options);
      res.json(products); // Return array directly, not wrapped in object
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
      const product = await ProductService.create(req.body, (req as any).user._id);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const product = await ProductService.update(req.params.id, req.body, (req as any).user._id);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ProductService.delete(req.params.id, (req as any).user._id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async trending(req: Request, res: Response) {
    try {
      const products = await ProductService.getTrending();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async compare(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const products = await ProductService.getByIds(ids);
      res.json({ products });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await ProductService.getAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
