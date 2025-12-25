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
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        {user ? (
          <>
            <UserButton />
            <StockList userId={user?.id ?? null}></StockList>
          </>
        ) : (
          <p>Loading user ...</p>
        )}
      </SignedIn>
    </header>
  );
}

export default App;
