// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
// import { Button } from "@mui/material"; // Import Material UI Button for the download button

// const SupervisorHrPayroll = () => {
//   const [supervisorId, setSupervisorId] = useState("");
//   const [month, setMonth] = useState("");
//   const [payrollHistory, setPayrollHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const apiBaseUrl = process.env.VITE_BASE_API;

//   // Fetch employee list on component mount
//   const [supervisors, setSupervisors] = useState([]);
//   useEffect(() => {
//     axios
//       .get(`${apiBaseUrl}/api/supervisor_list/`)
//       .then((response) => {
//         setSupervisors(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching supervisor list", error);
//       });
//   }, []);

//   // Fetch payroll history on component mount
//   useEffect(() => {
//     axios
//       .get(`${apiBaseUrl}/supervisor-payroll-history/`)
//       .then((response) => {
//         setPayrollHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching payroll history", error);
//       });
//   }, []);

//   // Handle the payroll generation
//   const handleGeneratePayslip = () => {
//     if (!supervisorId || !month) {
//       setError("Please provide both Supervisor ID and Month.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMessage("");

//     // Make the API request to generate the payslip
//     axios
//       .post(`${apiBaseUrl}/supervisor/process-payroll/`, {
//         supervisor_id: supervisorId,
//         month,
//       })
//       .then((response) => {
//         if (response.data.success) {
//           setMessage(`Payslip generated successfully!`);
//           setPayrollHistory((prevHistory) => [
//             ...prevHistory,
//             { ...response.data, month, supervisorId },
//           ]);
//         } else {
//           setError(response.data.message);
//         }
//       })
//       .catch((error) => {
//         setError("An error occurred while generating the payslip.");
//         console.error("Error generating payslip", error);
//       })
//       .finally(() => setLoading(false));
//   };

//   const handleDownload = (pdfPath) => {
//     const downloadUrl = `/media/payslips/${pdfPath}`;
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = pdfPath;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // MUI DataGrid columns
//   const columns = [
//     { field: "id", headerName: "ID", width: 200 },
//     { field: "user", headerName: "Supervisor Name", width: 200 },
//     { field: "month", headerName: "Month", width: 150 },
//     { field: "net_salary", headerName: "Net Salary", width: 150 },
//     {
//       field: "action",
//       headerName: "Actions",
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleDownload(params.row.pdf_path)}
//         >
//           Download
//         </Button>
//       ),
//       width: 150,
//     },
//   ];

//   // Map payroll history into rows, ensuring each row has a unique id
//   const rows = payrollHistory.map((payroll, index) => ({
//     id: payroll.id, // Ensure each row has a unique ID
//     user: payroll.user,
//     month: payroll.month,
//     net_salary: payroll.net_salary,
//     pdf_path: payroll.pdf_path,
//   }));

//   return (
//     <div className="min-h-dvh p-4 flex flex-col h-full">
//       <div className="flex justify-between items-center mb-4">
//         <h2>Supervisor Payroll</h2>

//         <form action="" className="flex">
//           <select
//             value={supervisorId}
//             onChange={(e) => setSupervisorId(e.target.value)}
//           >
//             <option value="">Select Supervisor</option>
//             {supervisors.map((supervisor) => (
//               <option key={supervisor.supervisor_id} value={supervisor.supervisor_id}>
//                 {supervisor.name} {supervisor.supervisor_name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//           />
//           <button className="primary-btn" onClick={handleGeneratePayslip} disabled={loading}>
//             {loading ? "Generating..." : "Generate Payslip"}
//           </button>
//         </form>
//       </div>

//       {/* Generate Payslip Form */}

//       {/* {error && <div className="error">{error}</div>}
//       {message && <div className="message">{message}</div>} */}
//       {/* Payroll History using MUI DataGrid */}
//       <div className="h-full bg-white/50 flex-1">
//         <DataGrid
//           className="h-full"
//           rows={rows}
//           columns={columns}
//           pageSize={5}
//           rowsPerPageOptions={[5]}
//           checkboxSelection
//           loading={loading}
//         />
//       </div>
//     </div>
//   );
// };

// export default SupervisorHrPayroll;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@mui/material";

const SupervisorPayroll = () => {
  const [supervisorId, setSupervisorId] = useState("");
  const [month, setMonth] = useState("");
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const apiBaseUrl = process.env.VITE_BASE_API;

  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/supervisor_list/`)
      .then((response) => setSupervisors(response.data))
      .catch((error) => console.error("Error fetching supervisor list", error));
  }, []);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/supervisor-payroll-history/`)
      .then((response) => setPayrollHistory(response.data))
      .catch((error) => console.error("Error fetching payroll history", error));
  }, []);

  const handleGeneratePayslip = () => {
    if (!supervisorId || !month) {
      setError("Please provide both Supervisor ID and Month.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    axios
      .post(`${apiBaseUrl}/supervisor/process-payroll/`, {
        supervisor_id: supervisorId,
        month,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage(`Payslip generated successfully!`);
          setPayrollHistory([
            ...payrollHistory,
            { ...response.data, month, supervisorId },
          ]);
        } else {
          setError(response.data.message);
        }
      })
      .catch(() => setError("An error occurred while generating the payslip."))
      .finally(() => setLoading(false));
  };

  const handleDownload = (pdfPath) => {
    const downloadUrl = `/media/payslips/${pdfPath}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = pdfPath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-dvh p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2>Supervisor Payroll</h2>

        <form className="flex gap-2">
          <select
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
          >
            <option value="">Select Supervisor</option>
            {supervisors.map((supervisor) => (
              <option
                key={supervisor.supervisor_id}
                value={supervisor.supervisor_id}
              >
                {supervisor.name} {supervisor.supervisor_name}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            className="primary-btn"
            onClick={handleGeneratePayslip}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Payslip"}
          </button>
        </form>
      </div>

      <div className="border rounded p-4 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no</TableHead>
              <TableHead>Supervisor Name</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollHistory.map((payroll, index) => (
              <TableRow key={payroll.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payroll.user}</TableCell>
                <TableCell>{payroll.month}</TableCell>
                <TableCell>{payroll.net_salary}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="contained" color="primary">
                        Download Options
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleDownload(payroll.pdf_path)}
                      >
                        Download Payslip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SupervisorPayroll;
