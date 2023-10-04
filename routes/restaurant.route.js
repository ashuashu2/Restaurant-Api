require("dotenv").config()
const express = require("express");
const restaurentRouter = express.Router();
const restaurantModel = require("../models/retaurantModel")


//   create new restaurent

async function addRestaurentHandler(newRestaurent){
    const isRestaurentExist = await restaurantModel.findOne({name : newRestaurent.name})
    if(isRestaurentExist ){
      console.log("restaurant already exist")
    }else{
      const updateRestaurant = new restaurantModel(newRestaurent);
      const saveRestaurant = await updateRestaurant.save()
      const restaurant = await restaurantModel.find({})
  
      return{ saveRestaurant ,  restaurant } ;

    }
    
 

   }


  restaurentRouter.post("/create",async(req,res)=>{
    const newRestaurent = req.body;
    try {
      const {restaurant , saveRestaurant} = await addRestaurentHandler(newRestaurent);
    res.json({Totlerestaurant :  restaurant.length , newRestaurent  : saveRestaurant  })
      
    } catch (error) {
      res.json("restaurant already exist")
      
    }
    

  })



//  find all restaurent 


async  function readAllRestaurent(){
try {
  const restaurant = await restaurantModel.find({})

  return restaurant
  
} catch (error) {
  console.log("something went wrong")
}
} 


restaurentRouter.get('/allrestaurant', async (req, res) => {
  try {

    const findAllRestaurant = await readAllRestaurent();
    res.json({findAllRestaurant , nbhits :findAllRestaurant.length });
  } catch (error) {
    res.status(404).json({ error: 'restaurant not available' });
  }
});






//   //  sort restaurant by ratings 


async  function sortRestaurantByRating(){
    try {
      const restaurant = await restaurantModel.find({}).sort({averageRating:1})
    
      return restaurant
      
    } catch (error) {
      console.log("something went wrong")
    }
    } 
    
    
    restaurentRouter.get('/rating', async (req, res) => {
      try {
    
        const findAllrestaurant = await sortRestaurantByRating();
        res.json(findAllrestaurant);
      } catch (error) {
        res.status(404).json({ error: 'restaurant not available' });
      }
    });




//  find restaurent by title 




async function findRstauranteByName(nameOfRestaurant) {
    try {
      const restaurant = await restaurantModel.findOne({name: nameOfRestaurant });
      if (restaurant) {
        return restaurant;
      } else {
        throw new Error("restaurant not found")
      }
    } catch (error) {
      throw error;
    }
  }
  
  
  
  
  
  
  restaurentRouter.get('/name/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const restaurant = await findRstauranteByName(name);
      if (restaurant) {
        res.json(restaurant);
      } else {
        res.status(404).json({ error: 'restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
  });
  





//  find restaurent by id 
async function findRestaurantById(id) {
  try {
    const restaurant = await restaurantModel.findById(id);
    if (restaurant) {
     
      return restaurant;
    } else {
      throw new Error("restaurant not found")
    }
  } catch (error) {
    throw error;
  }
}

restaurentRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    console.log(id)

    const restaurant = await findRestaurantById(id);
    console.log(restaurant)

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: 'restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});






//  find restaurent by cuisine type

async function findRestaurantByCuisine(cuisineType) {
    try {
      const restaurant = await restaurantModel.find({cuisine: cuisineType });
      if (restaurant) {
        return restaurant;
      } else {
        throw new Error("restaurant not found")
      }
    } catch (error) {
      throw error;
    }
  }
  
  restaurentRouter.get('/cuisineType/:cuisine', async (req, res) => {
    try {
      const cuisine = req.params.cuisine;
      const restaurant = await findRestaurantByCuisine(cuisine);
      if (restaurant) {
        res.json({restaurant, nbhits:restaurant.length});
      } else {
        res.status(404).json({ error: 'restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
  });
  




//  find restaurent by location 




async function findRestaurantByLocation(title) {
    try {
      const restaurant = await restaurantModel.findOne({city: title });
      if (restaurant) {
        return restaurant;
      } else {
        throw new Error("restaurant not found")
      }
    } catch (error) {
      throw error;
    }
  }
  
  
  
  
  
  
  restaurentRouter.get('/search/:location', async (req, res) => {
    try {
      const location = req.params.location;
      const restaurant = await findRestaurantByLocation(location);
      if (restaurant) {
        res.json(restaurant);
      } else {
        res.status(404).json({ error: 'restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
  });
  

    



 
 async function addRatingAndReview(movieId, userId, rating, reviewText) {
    try {
      const movie = await movieModel.findById(movieId);
      console.log({ movie })
      if (movie) {
        movie.ratings.push(rating);
  
        const review = {
          user: userId,
          text: reviewText,
        };
        movie.reviews.push(review);
  
        await movie.save();
  
        const updatedMovieWithReview = await movieModel.findById(movieId).populate('reviews.user', 'username profilePictureUrl');
        return updatedMovieWithReview;
      } else {
        throw new Error("Movie not found");
      }
    } catch (error) {
      throw error;
    }
  }


  
  restaurentRouter.post('/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const { userId, rating, review } = req.body;
  
      const updatedMovie = await addRatingAndReview(movieId, userId, rating, review);
      res.json(updatedMovie);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });
  
  async function getMovieReviewsWithUserDetails(movieId) {
    try {
      const movie = await movieModel.findById(movieId).populate({
        path: 'reviews',
        populate: {
  
          path: 'user', select: 'username profilePictureUrl'
        },
      });
      const reviewsWithUserDetails = movie.reviews.slice(0, 3).map(review => ({
        reviewText: review.text,
        user: review.user,
      }));
      return reviewsWithUserDetails;
    } catch (error) {
      throw error;
    }
  }
  
  restaurentRouter.get('/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviewsWithUserDetails = await getMovieReviewsWithUserDetails(movieId);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });






  













//   update restaurant by title



  async function updateRestaurantDetails(name, restaurantDetails) {
    try {
      const restaurant = await restaurantModel.findOne({ name });
      if (restaurant) {
        Object.assign(restaurant, restaurantDetails);
        const updatedrestaurant = await restaurant.save();
        console.log(updatedrestaurant)
        return updatedrestaurant;
      } else {
        throw new Error("restaurant not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  restaurentRouter.post('/update-details/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const restaurantDetails = req.body;
      console.log(restaurantDetails)
      const updatedRestaurant = await updateRestaurantDetails(name, restaurantDetails);
      res.json(updatedRestaurant);
    } catch (error) {
      res.status(404).json({ error: 'restaurant not updated' });
    }
  });



//   delete a restaurant by id



async function deleteRestaurantHandler(id) {
    try {
      const restaurant = await restaurantModel.findByIdAndDelete(id);
      console.log({restaurant})
     const availableRestaurants = await restaurantModel.find({})
       
       
        return availableRestaurants;
      
    } catch (error) {
      throw error;
    }
  }
  
  restaurentRouter.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const availableRestaurant = await deleteRestaurantHandler(id);
      res.json({availableRestaurant, totle: availableRestaurant.length});
    } catch (error) {
      res.status(404).json({ error: 'movie not updated' });
    }
  });



  module.exports = restaurentRouter