// Test 1: Check if collection exists and has data
db.getCollectionNames()

// Test 2: Check if hr_signup collection exists
db.hr_signup.find().limit(1)

// Test 3: Try different collection names
db.hr_signup.find({HRID: "f63d39d8-5941-4182-9e89-7452de766860"})
db.getCollection("hr_signup").find({HRID: "f63d39d8-5941-4182-9e89-7452de766860"})

// Test 4: Check by ObjectId
db.hr_signup.find({_id: ObjectId("6790b88a4442fd9fe8810841")})

// Test 5: Simple aggregation test
db.hr_signup.aggregate([
  {
    $match: {
      _id: ObjectId("6790b88a4442fd9fe8810841")
    }
  },
  {
    $project: {
      _id: 1,
      companyName: 1,
      Plans: 1
    }
  }
]) 