import { QuoteSimulator } from "my-v0-project"

/* The app's real quote recopilador. Zero-prop; defaults to an international
   MX→USA route with the empty summary panel until origin/destination pick. */
export const Vista = () => (
  <div className="w-[420px]">
    <QuoteSimulator />
  </div>
)
