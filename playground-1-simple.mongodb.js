const currentDate = Math.floor(new Date().getTime() / 1000);

// Simple query to filter plans by featureType and expiryDate
db.getCollection("hr_signup").aggregate([
  {
    $match: {
      HRID: "f63d39d8-5941-4182-9e89-7452de766860"
    }
  },
  {
    $project: {
      companyName: 1,
      email: 1,
      // Active JOB_POSTING plans (not expired)
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
      // Active JOB_UPLOADING plans (not expired)
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
      // Expired JOB_POSTING plans
      expiredJobPostingPlans: {
        $filter: {
          input: "$Plans",
          as: "plan",
          cond: {
            $and: [
              { $eq: ["$$plan.featureType", "JOB_POSTING"] },
              { $lte: ["$$plan.expiryDate", currentDate] }
            ]
          }
        }
      },
      // Expired JOB_UPLOADING plans
      expiredJobUploadingPlans: {
        $filter: {
          input: "$Plans",
          as: "plan",
          cond: {
            $and: [
              { $eq: ["$$plan.featureType", "JOB_UPLOADING"] },
              { $lte: ["$$plan.expiryDate", currentDate] }
            ]
          }
        }
      }
    }
  }
]) 