import { Router } from "express";
import { FoodModel } from "../models/food.model.js";
import handel from 'express-async-handler';

const router = Router();


//http://localhost:5000/api/foods
router.get('/', handel ( async (req, res) =>{ 
    const foods = await FoodModel.find({ });         
    res.send(foods);
})
);

//http://localhost:5000/api/foods/tags
router.get('/tags', handel(async (req,res) =>{ 
     const tags = await FoodModel.aggregate([
        {
            $unwind : '$tags',
        },
        {
            $group :{
                _id:'$tags',
                count : { $sum : 1}
            },
        },
        {
            $project:{
                _id: 0,
                name: '$_id',
                count: '$count',
            },
        },
     ]).sort({count : -1});
     
    const all = {
        name:'All',
        count : await FoodModel.countDocuments(),
    };
    tags.unshift(all);
    res.send(tags);
})
);


// http://localhost:5000/api/foods/search/Pizza
router.get('/search/:searchTerm',handel(async (req, res) =>{    
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, 'i');

    const foods = await FoodModel.find({ name: { $regex:searchRegex}});
    res.send(foods);
})
);


// //http://localhost:5000/api/foods/tag/lunch
// router.get('/tag/:tag', handel(async (req, res) => {   
//     const { tag } = req.params;
//     const foods = FoodModel.find({tags:tag});
//     res.send(foods);
// })
// );

// http://localhost:5000/api/foods/tag/lunch
router.get('/tag/:tag', handel(async (req, res) => {   
    const { tag } = req.params;

    try {
        // Use await to execute the query
        const foods = await FoodModel.find({ tags: tag });

        // Send the result as JSON
        res.json(foods);
    } catch (error) {
        // Handle any errors
        console.error('Error finding foods by tag:', error.message);
        res.status(500).send('Internal Server Error');
    }
}));




                                            

//http://localhost:5000/api/foods/1
router.get('/:foodId', handel(async (req, res) => {     
    console.log('Handling request for foodId:', req.params.foodId);
  
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
  
    console.log('Found food:', food);
  
    res.send(food);
  }));


export default router;

