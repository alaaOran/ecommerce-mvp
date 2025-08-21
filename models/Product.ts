import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: false,
    trim: true,
    unique: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['t-shirts', 'joggers', 'hoodies', 'shoes', 'accessories'] // Updated categories
  },
  subcategory: {
    type: String,
    required: true
  },
  brand: String,
  images: [{
    url: String,
    alt: String
  }],
  sizes: [{
    size: String,
    stock: { type: Number, default: 0 }
  }],
  colors: [String],
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  totalStock: {
    type: Number,
    default: 0
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ slug: 1 })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)