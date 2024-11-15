import { Navigate, Route, Routes } from "react-router-dom";
import GetTicket from "./components/GetTicket.tsx";
import CallCustomer from "./components/CallCustomer.tsx";

import "./App.css";
import TopBar from "./components/TopBar.tsx";
import { useAuthContext } from "./contexts/AuthContext.tsx";
import CallNextCustomer from "./components/CallNextCustomer.tsx";
import TicketPage from "./components/TicketPage.tsx";
import { Login } from "./components/Login.tsx";

const App = () => {
  const { loggedIn } = useAuthContext();
  return (
    <div className="app-container">
      <h1>Office Queue Management</h1>
      <Routes>
        <Route path="/" element={<TopBar />}>
          <Route index element={<GetTicket />} />
          <Route
            path="/ticket/:serviceTag/:waitlistCode"
            element={<TicketPage />}
          />
          <Route path="/display" element={<CallCustomer />} />
          <Route path="/officer" element={<CallNextCustomer />} />
          <Route
            path="login"
            element={loggedIn ? <Navigate replace to="/officer" /> : <Login />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
