

//working


// export const sendReportQueryToAPI = async (message) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/report-query", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: message }),
//     });

//     const data = await response.json();
//     console.log(data)
//     return data; // Expecting a response like { reply: "Generated SQL query: ..." }
//   } catch (error) {
//     console.error("Error calling report query API:", error);
//     return { reply: "Error: Could not reach the server." };
//   }
// };


// working backend conn

// export const sendReportQueryToAPI = async (message) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/report-query", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: message }),
//     });

//     const data = await response.json();
//     console.log('API Response:', data);  // Check the raw response format

//     // Make sure the data is in the correct format
//     if (Array.isArray(data) && data.length > 0) {
//       return { reply: "Report generated successfully", data }; // Return the report data correctly
//     } else {
//       console.error("Unexpected response format:", data);
//       return { reply: "Error: Unexpected response format.", data: [] }; // Return empty array in case of error
//     }
//   } catch (error) {
//     console.error("Error calling report query API:", error);
//     return { reply: "Error: Could not reach the server.", data: [] }; // Ensure empty data on error
//   }
// };


export const sendReportQueryToAPI = async (message) => {
  try {
    const response = await fetch("http://localhost:5000/api/report-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    // Handle clarification response
    if (data.clarification_required) {
      return {
        clarification: true,
        message: data.message,
        options: data.options,
      };
    }

    // Handle successful report data
    if (Array.isArray(data) && data.length > 0) {
      return {
        reply: "Report generated successfully",
        data,
      };
    } else {
      // Fallback for other errors
      return {
        reply: data.error || "Error: Unexpected response format.",
        data: [],
      };
    }
  } catch (error) {
    console.error("Error calling report query API:", error);
    return {
      reply: "Error: Could not reach the server.",
      data: [],
    };
  }
};


