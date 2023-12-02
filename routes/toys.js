
const express = require("express");
const { auth } = require("../middlewerare/auth");
const { ToyModel,validToy} =  require("../Model/toyModel");
const router = express.Router();

// GET all items from all users
router.get("/all", async(req,res) => {
    let data = await ToyModel
    .find({})
     res.json(data);
})
// GET my items from my user with Token
router.get("/myshop",auth, async(req,res) => {
    let myId = req.tokenData._id;
    let data = await ToyModel
    .find({createdUser:myId})
  
    res.json(data);
})

//   Get by search => search?s=""
  router.get("/search", async (req, res) => {
   
    try {
        let searchQ = req.query.s;
        let searchReg = new RegExp(searchQ, "i");
        let data = await ToyModel
.find({ $or: [{ name: searchReg }, { color: searchReg },{ info: searchReg }] })
            
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
}) 
// Get by category => category/:catName
router.get("/category/:cat", async (req, res) => {
  
    try {
        let searchQ = req.params.cat;
        let searchReg = new RegExp(searchQ, "i");
        let data
         = await ToyModel
            .find({ category: searchReg })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
})
// Get by prices 
router.get("prices", async (req, res) => {
 
  try {
  let minP = req.query.min;
  let maxP = req.query.max;
  if(minP && maxP){
    let data = await ToyModel.find({$and:[{price:{$gte:minP}},{price:{$lte:maxP}}]})
    res.json(data);
  }
  else if(maxP){
    let data = await ToyModel.find({price:{$lte:maxP}})
    res.json(data);
  }else if(minP){
    let data = await ToyModel.find({price:{$gte:minP}})

    res.json(data);
  }else{
    let data = await ToyModel.find({})
    res.json(data);
  }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err22: err });
    }
})

// POST new item by Token
router.post("/" ,auth, async (req,res) => {
    let validBody = validToy
(req.body);
    let user_id = req.tokenData._id;
    if(user_id == null || user_id == "undefined"){
        return res.status(401).json({msg:"User id is not found !"});
    }
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    let item = new ToyModel
(req.body);
    item.createdUser = user_id;
    await item.save();
    res.json(item);
  })
//   Edit item with a Token
  router.put("/:editId",auth, async(req,res) => {
    let validBody = validToy
(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let editId = req.params.editId;
      let data = await ToyModel
.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
//   Delete item with a Token
  router.delete("/:DelId",auth, async(req,res) => {
    try{
      let DelId = req.params.DelId;
      let data = await ToyModel
.deleteOne({_id:DelId,user_id:req.tokenData._id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })

module.exports = router;