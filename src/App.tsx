import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import StockList from "./components/StockList";

function App() {
  const { user } = useUser();
  return (
    <div className="app-container">
      <header>
        <h1>Finact</h1>
        <h3>Track your favourite stocks</h3>
      </header>
      <SignedOut>
        <div>
          <p>Login to manage your stocks!</p>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        {user ? (
          <>
            <div className="user-header">
              <UserButton />
              <p>Hello, {user.firstName || user.username || "User"}!</p>
            </div>
            <StockList userId={user?.id ?? null}></StockList>
          </>
        ) : (
          <p>Loading user ...</p>
        )}
      </SignedIn>
    </div>
  );
}

export default App;
