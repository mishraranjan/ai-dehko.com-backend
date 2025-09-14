import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  categories: [{ type: String }],  // e.g., ['Marketing', 'Financial']
  tags: [{ type: String }],  // e.g., ['automation', 'cloud']
  usps: [{ type: String }],  // Unique Selling Points array
  features: [{  // Specifications/Features
    name: String,
    description: String,
  }],
  reviews: [{  // Embedded for reviews/ratings
    user: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now },
  }],
  gallery: [{ type: String }],  // Image/video URLs
  price: Number,  // For sorting/filtering
  purchaseLink: String,  // Affiliate integration
  popularity: { type: Number, default: 0 },  // For trending/sorting
  seoMetadata: {  // For SEO
    title: String,
    description: String,
  },
}, { timestamps: true });

// Indexes for search/filter/sort
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ tags: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ popularity: -1, 'reviews.rating': -1 });  // For trending/high-rated

export default models.Product || model('Product', productSchema);