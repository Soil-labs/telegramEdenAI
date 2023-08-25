import dotenv from "dotenv";
import {
  findProjects,
} from "./backEnd_api_func.js";



dotenv.config();

console.log("I am alive!");


// --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------
const speed_CalculateCVsummaryJobsNodes = 2000;
let repeatCalculateCVsummaryJobsNodesVar = setInterval(repeatCalculateCVsummaryJobsNodesFunc, speed_CalculateCVsummaryJobsNodes);
// --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------



async function repeatCalculateCVsummaryJobsNodesFunc() {

  
  console.log("hello = " )


  
  clearInterval(repeatCalculateCVsummaryJobsNodesVar);
  
  repeatCalculateCVsummaryJobsNodesVar = setInterval(repeatCalculateCVsummaryJobsNodesFunc, speed_CalculateCVsummaryJobsNodes);
}
