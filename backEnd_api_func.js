import apiClient from "./api/axios.js";
// import apiClientCron from "./api/axiosCron.js";
// import apiClientCron from "./api/axiosCron.js";

export async function findProjects() {
  let res = await apiClient({
    data: {
      query: `query{
        findProjects(fields:{
            # serverID: "996558082098339953"
        }){
            _id
            title
            
        }
        }`,
    },
  });

  return res.data.data.findProjects;
}
