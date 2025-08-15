const currentDate = Math.floor(new Date().getTime() / 1000);

// Working version using ObjectId
db.getCollection("hr_signup").aggregate([
  {
    $match: {
      _id: ObjectId("6790b88a4442fd9fe8810841")
    }
  },
  {
    $project: {
      _id: 1,
      companyName: 1,
      email: 1,
      totalJobPosted: 1,
      totalJobUploaded: 1,
      // Filter JOB_POSTING plans that haven't expired
      activeJobPostingPlans: {
        $filter: {
          input: "$Plans",
          as: "plan",
          cond: {
            $and: [
              { $eq: ["$$plan.featureType", "JOB_POSTING"] },
              { $gt: ["$$plan.expiryDate", currentDate] }
            ]
          }
        }
      },
      // Filter JOB_UPLOADING plans that haven't expired
      activeJobUploadingPlans: {
        $filter: {
          input: "$Plans",
          as: "plan",
          cond: {
            $and: [
              { $eq: ["$$plan.featureType", "JOB_UPLOADING"] },
              { $gt: ["$$plan.expiryDate", currentDate] }
            ]
          }
        }
      }
    }
  },
  {
    $addFields: {
      // Calculate totals for active JOB_POSTING plans
      jobPostingTotalCredits: { $sum: "$activeJobPostingPlans.receivedLimits" },
      jobPostingRemainingCredits: { $sum: "$activeJobPostingPlans.creditLeft" },
      jobPostingUsedCredits: {
        $subtract: [
          { $sum: "$activeJobPostingPlans.receivedLimits" },
          { $sum: "$activeJobPostingPlans.creditLeft" }
        ]
      },
      
      // Calculate totals for active JOB_UPLOADING plans
      jobUploadingTotalCredits: { $sum: "$activeJobUploadingPlans.receivedLimits" },
      jobUploadingRemainingCredits: { $sum: "$activeJobUploadingPlans.creditLeft" },
      jobUploadingBlockedCredits: { $sum: "$activeJobUploadingPlans.blockedCredits" },
      jobUploadingUsedCredits: {
        $subtract: [
          { $sum: "$activeJobUploadingPlans.receivedLimits" },
          { $sum: "$activeJobUploadingPlans.creditLeft" }
        ]
      }
    }
  }
]) 