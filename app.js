const date = require(__dirname+'/date.js');
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
//local connection
//mongoose.connect("mongodb://localhost:27017/todolistDB");

//connect with atlas mongodb
mongoose.connect("mongodb+srv://admin:admin@cluster0.dycul.mongodb.net/todolistDB");

//shell command to connect with atlas mongodb
// $ mongo "mongodb+srv://cluster0.dycul.mongodb.net/testDB" --username admin
// password: admin    username: admin


app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Complete SDS"
});

const item2 = new Item({
  name: "Complete Assignment"
});

const item3 = new Item({
  name: "Complete Course"
});

const listItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);

const day = date.getDate();

app.get('/', function(req, res) {

  Item.find(function(err, element){
    if (err) {
      console.log(err);
    }
    else if (element.length === 0) {
      Item.insertMany(listItems, function(err, res){
        if(err){
          console.log(err);
        }
        else {
          console.log("Inserted 3 default items Successfully");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list", {listTitle: day, newItems: element});
    }
  })

});

app.get("/:customListName", function(req, res){
  const listName = _.capitalize(req.params.customListName);
  List.findOne({name: listName}, function(err, foundList){
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: listItems
        });
        list.save();
        res.redirect("/"+listName);
      }
      else {
        res.render("list", {listTitle: foundList.name, newItems: foundList.items});
      }
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
})


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const addItem = new Item({
    name: itemName
  })
  if (listName === day) {
    addItem.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listName}, function(err, foundlist){
      foundlist.items.push(addItem);
      foundlist.save();
      res.redirect("/"+listName);
    })
  }

});

app.post("/delete", function(req, res){
  const delItem = req.body.check;
  const listTitle = req.body.thisListName;

  if (listTitle === day) {
    Item.deleteOne({_id: delItem}, function(err){
        if (err) {
          console.log(err);
        }
        else {
          res.redirect("/");
        }
    });
  }
  else {
    List.findOneAndUpdate({name: listTitle}, {$pull: {items: {_id: delItem}}}, function(err, result){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/"+listTitle);
      }
    })
  }

})

app.listen(3000, function() {
  console.log("server running at port 3000");
});
