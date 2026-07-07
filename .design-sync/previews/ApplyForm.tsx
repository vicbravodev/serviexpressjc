import { ApplyForm } from "my-v0-project"

/* The app's real driver-application form. Zero-prop; the submit button starts
   disabled until name, phone, position and experience are all filled. */
export const Vista = () => (
  <div className="w-[420px]">
    <ApplyForm />
  </div>
)
