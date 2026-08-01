import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;