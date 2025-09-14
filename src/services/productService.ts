import Product from '../models/Product';
import { ActivityService } from './activityService';

interface CreateProductPayload {
  name: string; description: string; categories: string[]; tags: string[];
  usps: string[]; features: { name: string; description: string }[];
  gallery: string[]; price?: number; purchaseLink?: string; 
  seoMetadata?: { title: string; description: string };
}

interface FilterOptions { 
  category?: string; tags?: string[]; sort?: string; 
  limit?: number; page?: number; search?: string; 
}

export class ProductService {
  static async create(payload: CreateProductPayload, userId: string): Promise<any> {
    const product = new Product(payload);
    await product.save();
    
    // Log activity
    await ActivityService.logActivity({
      type: 'product_created',
      description: `Created product "${product.name}"`,
      userId,
      targetId: product._id.toString(),
      targetName: product.name
    });
    
    return product;
  }

  static async getAll(options: FilterOptions = {}): Promise<any> {
    let query: any = {};
    if (options.category) query.categories = { $in: [options.category] };
    if (options.tags) query.tags = { $in: options.tags };
    if (options.search) query.$text = { $search: options.search };

    const sort: any = options.sort === 'ratings' ? { 'reviews.rating': -1 } : { popularity: -1 };
    const limit = options.limit || 20;
    const skip = ((options.page || 1) - 1) * limit;

    return Product.find(query).sort(sort).limit(limit).skip(skip);
  }

  static async getById(id: string): Promise<any> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async update(id: string, payload: Partial<CreateProductPayload>, userId: string): Promise<any> {
    const product = await Product.findByIdAndUpdate(id, payload, { new: true });
    if (!product) throw new Error('Product not found');
    
    // Log activity
    await ActivityService.logActivity({
      type: 'product_updated',
      description: `Updated product "${product.name}"`,
      userId,
      targetId: product._id.toString(),
      targetName: product.name
    });
    
    return product;
  }

  static async delete(id: string, userId: string): Promise<void> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    
    const productName = product.name;
    await Product.findByIdAndDelete(id);
    
    // Log activity
    await ActivityService.logActivity({
      type: 'product_deleted',
      description: `Deleted product "${productName}"`,
      userId,
      targetId: id,
      targetName: productName
    });
  }

  static async getTrending(): Promise<any> {
    return Product.find().sort({ popularity: -1 }).limit(10);
  }

  static async getByIds(ids: string[]): Promise<any> {
    return Product.find({ _id: { $in: ids } });
  }

  static async getAnalytics(): Promise<any> {
    const totalProducts = await Product.countDocuments();
    const categoryStats = await Product.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const avgRating = await Product.aggregate([
      { $unwind: '$reviews' },
      { $group: { _id: null, avgRating: { $avg: '$reviews.rating' } } }
    ]);

    const topProducts = await Product.find().sort({ popularity: -1 }).limit(5);
    
    return {
      totalProducts,
      categoryStats,
      avgRating: avgRating[0]?.avgRating || 0,
      topProducts
    };
  }

  static async addReview(productId: string, review: { user: string; rating: number; comment: string }): Promise<any> {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    product.reviews.push(review);
    await product.save();
    return product;
  }
}
