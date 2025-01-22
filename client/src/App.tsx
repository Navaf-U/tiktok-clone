import "./App.css";
import AppRoutes from "./AppRoutes";
import { Toaster } from "./components/ui/toaster";
import useConnectSocket from "./hooks/useConnectSocket";
function App() {
  useConnectSocket()
  return (
    <>
     <Toaster/>
      <AppRoutes />
    </>
  );
}

export default App;
