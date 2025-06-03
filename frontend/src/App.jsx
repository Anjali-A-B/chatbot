





import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./components/admin/Admin";
import Login from "./components/signup and login/LoginPage";
import Signup from "./components/signup and login/SignupPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import HomeRedirect from "./components/auth/HomeRedirect";
import CompanyHome from "./components/company/CompanyHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* <Routes> */}
          {/* <Route path="/" element={<Index />} /> */}

          {/* <Route path="/" element={<Index />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* <Route path="/admin" element={<Admin />} />   admin route */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} /> */}
        {/* </Routes> */}

        <Routes>
  <Route path="/" element={<HomeRedirect />} />
  {/* <Route path="/index" element={ <ProtectedRoute><Index /></ProtectedRoute> }/> */}
  <Route path="/index/:companyId" element={<ProtectedRoute><Index /></ProtectedRoute>} />

   <Route path="/company-home"element={ <ProtectedRoute> <CompanyHome /> </ProtectedRoute>}/>
  <Route path="/admin" element={ <AdminRoute> <Admin /> </AdminRoute>}/>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="*" element={<NotFound />} />
</Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
