const currentDate = Math.floor(new Date().getTime() / 1000);
 
db.getCollection("hr_signup").aggregate([
  {
    $match: {
      HRID: "f63d39d8-5941-4182-9e89-7452de766860"
    }
  },
  {
    $project: {
      jobposting: {
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
      jobuploading: {
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
      jobPosted: 1
    }
  },
  {
    $addFields: {
      totalcredits: { $sum: "$jobposting.receivedLimits" },
      totalremaining: { $sum: "$jobposting.creditLeft" },
      uploadedBlockedcredits: { $sum: "$jobuploading.blockedCredits" },
      uploadedrecievedcredits: { $sum: "$jobuploading.receivedLimits" },
      uploadedusablecredit: { $sum: "$jobuploading.creditLeft" },
      totalUsed: {
        $subtract: [
          { $sum: "$jobposting.receivedLimits" },
          { $sum: "$jobposting.creditLeft" }
        ]
      }
    }
  },
  {
    $addFields: {
      recentJobIds: {
        $cond: {
          if: { $isArray: "$jobPosted" },
          then: {
            $slice: [
              {
                $map: {
                  input: { $reverseArray: "$jobPosted" },
                  as: "jp",
                  in: "$$jp.Job_Id"
                }
              },
              "$totalUsed"
            ]
          },
          else: []
        }
      }
    }
  },
  {
    $lookup: {
      from: "job_posting",
      localField: "recentJobIds",
      foreignField: "Job_Id",
      as: "recentJobs"
    }
  },
  {
    $project: {
      totalcredits: 1,
      totalremaining: 1,
      uploadedBlockedcredits: 1,
      uploadedrecievedcredits: 1,
      uploadedusablecredit: 1,
      recentJobTitles: {
        $map: {
          input: "$recentJobs",
          as: "job",
          in: "$$job.Job_Title"
        }
      }
    }
  }
]) 