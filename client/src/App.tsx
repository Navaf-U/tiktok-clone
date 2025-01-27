import "./App.css";
import AppRoutes from "./AppRoutes";
import { Toaster } from "./components/ui/toaster";
function App() {
  return (
    <>
     <Toaster/>
      <AppRoutes />
    </>
  );
}

export default App;
