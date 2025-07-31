import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  selectedQty: Number,
});

const breakCalculatorSchema = new Schema(
  {
    noOfSpots: Number,
    costPerSpot: Number,
    profitMargin: String,
    platform: String,
    products: [productSchema],
    recommendedPrice: Number,
  },
  { timestamps: true }
);

const BreakCalculator =
  models.BreakCalculator || model('BreakCalculator', breakCalculatorSchema);

export default BreakCalculator;
