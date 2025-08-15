// const currentDate = Math.floor(new Date().getTime() / 1000);
use("zepcruit")
// Working version using ObjectId
// const currentDate = Math.floor(new Date().getTime() / 1000);

// db.getCollection("hr_signup").aggregate([
//   {
//     $match: {
//       email: "anuj@factacy.ai"
//     }
//   },
//   {
//     $addFields: {
//       // Filter active JOB_POSTING plans (not expired)
//       activeJobPostingPlans: {
//         $filter: {
//           input: "$Plans",
//           as: "plan",
//           cond: {
//             $and: [
//               { $eq: ["$$plan.featureType", "JOB_POSTING"] },
//               { $gt: ["$$plan.expiryDate", currentDate] }
//             ]
//           }
//         }
//       },
//       // Filter active JOB_UPLOADING plans (not expired)
//       activeJobUploadingPlans: {
//         $filter: {
//           input: "$Plans",
//           as: "plan",
//           cond: {
//             $and: [
//               { $eq: ["$$plan.featureType", "JOB_UPLOADING"] },
//               { $gt: ["$$plan.expiryDate", currentDate] }
//             ]
//           }
//         }
//       }
//     }
//   },
//   {
//     $addFields: {
//       // JOB_POSTING calculations
//       totalActiveJobPosting: { $sum: "$activeJobPostingPlans.receivedLimits" },
//       totalAvailableJobPosting: { $sum: "$activeJobPostingPlans.creditLeft" },
      
//       // JOB_UPLOADING calculations
//       totalReceivedJobUploading: { $sum: "$activeJobUploadingPlans.receivedLimits" },
//       totalBlockedJobUploading: { $sum: "$activeJobUploadingPlans.blockedCredits" },
//       totalCreditLeft: { $sum: "$activeJobUploadingPlans.creditLeft" }
//     }
//   },
//   {
//     $addFields: {
//       // Calculate totalJobPosted as difference
//       totalJobPosted: {
//         $subtract: ["$totalActiveJobPosting", "$totalAvailableJobPosting"]
//       }
//     }
//   },
//   {
//     $project: {
//       _id: 1,
//       companyName: 1,
//       email: 1,
      
//       // Final calculated metrics
//       totalActiveJobPosting: 1,
//       totalAvailableJobPosting: 1,
//       totalJobPosted: 1,
//       totalReceivedJobUploading: 1,
//       totalBlockedJobUploading: 1,
//       totalCreditLeft: 1,
      
//       // For verification - show the filtered plans
//     //   activeJobPostingPlans: 1,
//     //   activeJobUploadingPlans: 1
//     }
//   }
// ])

const currentDate = Math.floor(new Date().getTime() / 1000);

// // Test with real data structure
db.getCollection("hr_signup").aggregate([
  {
    $match: {
      _id: ObjectId("6790b88a4442fd9fe8810841")
    }
  },
  {
    $addFields: {
      // Filter active JOB_POSTING plans (not expired)
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
      // Filter active JOB_UPLOADING plans (not expired)
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
      // JOB_POSTING calculations
      totalActiveJobPosting: { $sum: "$activeJobPostingPlans.receivedLimits" },
      totalAvailableJobPosting: { $sum: "$activeJobPostingPlans.creditLeft" },
      
      // JOB_UPLOADING calculations
      totalReceivedJobUploading: { $sum: "$activeJobUploadingPlans.receivedLimits" },
      totalBlockedJobUploading: { $sum: "$activeJobUploadingPlans.blockedCredits" },
      totalCreditLeft: { $sum: "$activeJobUploadingPlans.creditLeft" }
    }
  },
  {
    $addFields: {
      // Calculate totalJobPosted as difference
      totalJobPosted: {
        $subtract: ["$totalActiveJobPosting", "$totalAvailableJobPosting"]
      }
    }
  },
  {
    $addFields: {
      // Get recent job IDs based on totalJobPosted count
      recentJobIds: {
        $cond: {
          if: { 
            $and: [
              { $isArray: "$jobPosted" },
              { $gt: ["$totalJobPosted", 0] }
            ]
          },
          then: {
            $slice: [
              {
                $map: {
                  input: { $reverseArray: "$jobPosted" },
                  as: "job",
                  in: "$$job.Job_Id"
                }
              },
              "$totalJobPosted"
            ]
          },
          else: []
        }
      },
      // Also show total jobPosted count for verification
      totalJobPostedCount: { $size: "$jobPosted" }
    }
  },
  {
    $lookup: {
      from: "job-posting",
      localField: "recentJobIds",
      foreignField: "Job_Id",
      as: "recentJobs"
    }
  },
  {
    $project: {
      _id: 1,
      companyName: 1,
      email: 1,
      
      // Final calculated metrics
      totalActiveJobPosting: 1,
      totalAvailableJobPosting: 1,
      totalJobPosted: 1,
      totalReceivedJobUploading: 1,
      totalBlockedJobUploading: 1,
      totalCreditLeft: 1,
      
      // Job information
      totalJobPostedCount: 1,
      recentJobIds: 1,
      recentJobTitles: {
        $map: {
          input: "$recentJobs",
          as: "job",
          in: "$$job.Job_Title"
        }
      },
      
      // For verification - show the filtered plans
    //   activeJobPostingPlans: 1,
    //   activeJobUploadingPlans: 1
    }
  }
])


// const currentDate = Math.floor(new Date().getTime() / 1000);

// // Debug the lookup stage
// db.getCollection("hr_signup").aggregate([
//   {
//     $match: {
//       _id: ObjectId("6790b88a4442fd9fe8810841")
//     }
//   },
//   {
//     $addFields: {
//       // Filter active JOB_POSTING plans (not expired)
//       activeJobPostingPlans: {
//         $filter: {
//           input: "$Plans",
//           as: "plan",
//           cond: {
//             $and: [
//               { $eq: ["$$plan.featureType", "JOB_POSTING"] },
//               { $gt: ["$$plan.expiryDate", currentDate] }
//             ]
//           }
//         }
//       },
//       // Filter active JOB_UPLOADING plans (not expired)
//       activeJobUploadingPlans: {
//         $filter: {
//           input: "$Plans",
//           as: "plan",
//           cond: {
//             $and: [
//               { $eq: ["$$plan.featureType", "JOB_UPLOADING"] },
//               { $gt: ["$$plan.expiryDate", currentDate] }
//             ]
//           }
//         }
//       }
//     }
//   },
//   {
//     $addFields: {
//       // JOB_POSTING calculations
//       totalActiveJobPosting: { $sum: "$activeJobPostingPlans.receivedLimits" },
//       totalAvailableJobPosting: { $sum: "$activeJobPostingPlans.creditLeft" },
      
//       // JOB_UPLOADING calculations
//       totalReceivedJobUploading: { $sum: "$activeJobUploadingPlans.receivedLimits" },
//       totalBlockedJobUploading: { $sum: "$activeJobUploadingPlans.blockedCredits" },
//       totalCreditLeft: { $sum: "$activeJobUploadingPlans.creditLeft" }
//     }
//   },
//   {
//     $addFields: {
//       // Calculate totalJobPosted as difference
//       totalJobPosted: {
//         $subtract: ["$totalActiveJobPosting", "$totalAvailableJobPosting"]
//       }
//     }
//   },
//   {
//     $addFields: {
//       // Get recent job IDs based on totalJobPosted count
//       recentJobIds: {
//         $cond: {
//           if: { 
//             $and: [
//               { $isArray: "$jobPosted" },
//               { $gt: ["$totalJobPosted", 0] }
//             ]
//           },
//           then: {
//             $slice: [
//               {
//                 $map: {
//                   input: { $reverseArray: "$jobPosted" },
//                   as: "job",
//                   in: "$$job.Job_Id"
//                 }
//               },
//               "$totalJobPosted"
//             ]
//           },
//           else: []
//         }
//       },
//       // Also show total jobPosted count for verification
//       totalJobPostedCount: { $size: "$jobPosted" }
//     }
//   },
//   {
//     $lookup: {
//       from: "job-posting",
//       localField: "recentJobIds",
//       foreignField: "Job_Id",
//       as: "recentJobs"
//     }
//   },
//   {
//     $project: {
//       _id: 1,
//       companyName: 1,
//       email: 1,
      
//       // Final calculated metrics
//       totalActiveJobPosting: 1,
//       totalAvailableJobPosting: 1,
//       totalJobPosted: 1,
//       totalReceivedJobUploading: 1,
//       totalBlockedJobUploading: 1,
//       totalCreditLeft: 1,
      
//       // Job information
//       totalJobPostedCount: 1,
//       recentJobIds: 1,
//     //   recentJobs: 1,  // Show the full lookup result
//       recentJobTitles: {
//         $map: {
//           input: "$recentJobs",
//           as: "job",
//           in: "$$job.Job_Title"
//         }
//       },
      
//       // For verification - show the filtered plans
//     //   activeJobPostingPlans: 1,
//     //   activeJobUploadingPlans: 1
//     }
//   }
// ])

