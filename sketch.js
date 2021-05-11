var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload()
{
sadDog = loadImage("Images/Dog.png");
happyDog = loadImage("Images/happy dog.png");
}

function setup() 
{
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed = createButton("FEED BOOTLES");
  feed.position(750,95);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD BOTTLES");
  addFood.position(900,95);
  addFood.mousePressed(addFoods);

}

function draw() 
{
  background("green");
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
 
  fill("red");
  textSize(20);
  if(lastFed>=12)
  {
    text("Last Fed : " + lastFed - 12 + " PM", 350, 30);
  }
  
  else if(lastFed === 0)
  {
     text("Last Fed : 12 AM", 350, 30);
  }
 
  else
  {
     text("Last Fed : " + lastFed + " AM", 350, 30);
  }
 
  drawSprites();

}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock() <= 0)
  {
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  
  else
  {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}