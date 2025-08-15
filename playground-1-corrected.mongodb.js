const currentDate = Math.floor(new Date().getTime() / 1000);
 
db.getCollection("hr_signup").aggregate([
  {
    $match: {
      HRID: "f63d39d8-5941-4182-9e89-7452de766860"
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
      },
      // Show all plans for comparison
      allPlans: "$Plans"
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
  },
  {
    $project: {
      _id: 1,
      companyName: 1,
      email: 1,
      totalJobPosted: 1,
      totalJobUploaded: 1,
      
      // Active plans summary
      activeJobPostingPlans: 1,
      activeJobUploadingPlans: 1,
      
      // JOB_POSTING credits
      jobPostingTotalCredits: 1,
      jobPostingRemainingCredits: 1,
      jobPostingUsedCredits: 1,
      
      // JOB_UPLOADING credits
      jobUploadingTotalCredits: 1,
      jobUploadingRemainingCredits: 1,
      jobUploadingBlockedCredits: 1,
      jobUploadingUsedCredits: 1,
      
      // All plans for reference
      allPlans: 1
    }
  }
]) 