import Product from '../models/Product';

interface CreateProductPayload {
  name: string; description: string; categories: string[]; tags: string[];
  usps: string[]; features: { name: string; description: string }[];
  gallery: string[]; price?: number; purchaseLink?: string; seoMetadata?: { title: string; description: string };
}

interface FilterOptions { category?: string; tags?: string[]; sort?: string; limit?: number; page?: number; search?: string; }

export class ProductService {
  static async create(payload: CreateProductPayload): Promise<any> {
    const product = new Product(payload);
    await product.save();
    return product;
  }

  static async getAll(options: FilterOptions = {}): Promise<any> {
    let query: any = {};
    if (options.category) query.categories = { $in: [options.category] };
    if (options.tags) query.tags = { $in: options.tags };
    if (options.search) query.$text = { $search: options.search };

    const sort: any = options.sort === 'ratings' ? { 'reviews.rating': -1 } : { popularity: -1 };
    const limit = options.limit || 20;
    const skip = (options.page || 1 - 1) * limit;

    return Product.find(query).sort(sort).limit(limit).skip(skip);
  }

  static async getById(id: string): Promise<any> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async update(id: string, payload: Partial<CreateProductPayload>): Promise<any> {
    const product = await Product.findByIdAndUpdate(id, payload, { new: true });
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async delete(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
  }

  // PRD: Comparison - Fetch multiple for table
  static async compare(ids: string[]): Promise<any[]> {
    if (ids.length > 3 || ids.length < 2) throw new Error('Select 2-3 products');
    return Promise.all(ids.map(id => this.getById(id)));
  }

  // PRD: Trending/Widgets - Top by popularity/ratings
  static async getTrending(category?: string, limit = 5): Promise<any[]> {
    let query: any = {};
    if (category) query.categories = { $in: [category] };
    return Product.find(query).sort({ popularity: -1, 'reviews.rating': -1 }).limit(limit);
  }

  // PRD: Add review (embedded)
  static async addReview(productId: string, review: { user: string; rating: number; comment: string }): Promise<any> {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    product.reviews.push(review);
    await product.save();
    return product;
  }
}