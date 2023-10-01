const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  cuisine: [{
    type: String,
    enum: ['Italian', 'Indian', 'French', 'Chinese', 'Japanese',  'Spanish', 'Thai', 'Mexican', 'American', 'others'],
  }],
  
  menu:[{
        name:{
            type: String,
            required: true,
            
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            
        },
        isVeg: {
            type: String,
           
        }
    }]
  ,
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  ratings: [{
    type: Number,
    min: 0,
    max: 10,
  }],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String, 
      userRating:String,
    },
  ],

}, {
  timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;