
Below is an explanation of each top-level folder and the files within them:

---

## app/

The Next.js 13 “App Router” directory containing route handlers and page-level layouts.

1. `app/layout.tsx`
   - The root layout for the entire Next.js application.  
   - Sets up global providers (AuthProvider, SessionProvider, etc.) and includes the Radix UI Theme setup.

2. `app/page.tsx`
   - The default or “home” page of the application, currently only displaying a placeholder text ("To Implement").

3. `app/login/page.tsx`
   - The login page where users (employee/admin/user roles) can authenticate.
   - Uses credentials from a simplified mock system in `AuthContext`.

4. `app/employee/page.tsx`
   - Main page for “Employee” role after login.
   - Uses MeetingProvider to manage meeting states.  
   - Redirects to the login page if the user is not authenticated as an “employee.”  
   - Integrates a `MeetingFlow` component to handle the employee’s screen for creating or joining a meeting.

5. `app/mobile/page.tsx`
   - Main page for “Mobile” experience (the client’s side).  
   - Shows a Terms & Conditions screen and transitions to a mobile-optimized chat interface once terms are accepted.

---

## components/

All shared UI components and subdirectories for more feature-specific components.

- **Top-level shared components**  
  - `ActionBar.tsx`  
    - A fixed action bar (bottom of screen in larger views) for composing text or audio messages.  
  - `ChatMessage.tsx`  
    - Displays an individual chat message, possibly from client, AI, or employee. Supports custom styles.  
  - `Logo.tsx`  
    - Displays the KWSP EPF logo.  
  - `MobileActionBar.tsx`  
    - Action bar geared toward mobile usage (buttons to type or speak).  
  - `MobileTitleBar.tsx`  
    - A simplified mobile-friendly top bar with a timer and toggle switch (e.g., for “Listening”).  
  - `SubTitleBar.tsx`  
    - A header used inside the employee’s chat flow that shows meeting info, a timer, microphone settings, and a segmented control to toggle layout.  
  - `TitleBar.tsx`  
    - The main top navigation bar that displays a logo, user info, and menu toggles.  

- **`components/employee/`**
  - `Chat.tsx`
    - The chat view for employees to see messages from both client and AI. Supports combined or split layout.  
  - `ClientDevice.tsx`
    - A screen that displays a QR code or code to invite a client to join.  
  - `MeetingFlow.tsx`
    - A high-level flow controller that renders either `NewMeeting`, `ClientDevice`, or `Chat` based on the current `MeetingContext` state.  
  - `NewMeeting.tsx`
    - A form for setting up a new meeting session (meeting name, client language, microphone, etc.).  
  - `WorkDevice.tsx`
    - (Not currently used) A sample device selection screen for employees to pick which device to use.

- **`components/mobile/`**
  - `Terms.tsx`
    - Terms and Conditions screen used on mobile.  
  - `Chat.tsx`
    - A simplified mobile chat screen. Combines messages from client and employee.  
  - `Speak.tsx`
    - A “listening” screen to record voice input, showing a pulsing microphone animation.

---

## context/

React context providers for application-wide state management:

1. `AuthContext.tsx`
   - Manages user authentication (mock credential system).  
   - Provides the current user (with role), loading state, and login/logout functions.

2. `SessionContext.tsx`
   - Tracks conversation or session state:  
     - sessionId, actor (user/employee/ai), language, isRecording, isProcessing, and form data.  
   - Persists relevant session info to `localStorage`.

3. `MeetingContext.tsx`
   - Focused on the employee’s meeting state (meetingStarted, clientConnected).  
   - Provides methods to start/reset the meeting and mark the client as connected.

---

## hooks/

Collection of custom React hooks.

- `useAudioRecorder.ts`
  - Hook for managing audio recording with the `MediaRecorder` API.  
  - Returns `startRecording`, `stopRecording`, plus relevant status flags (isRecording, error).

---

## lib/

More generic utility helper functions, typically reusable across the project.

- `utils.ts`
  - Contains a helper `cn` method that merges CSS classes using `clsx` and `tailwind-merge`.

---

## styles/

CSS and styling files.

1. `theme.css`
   - Defines custom CSS variables, fonts, and theme overrides (particularly around the `indigo`/`kwsp` color usage).  
2. `globals.css`
   - Global Tailwind and custom stylesheet imports.  
   - Applies base, components, utilities from Tailwind, plus additional app-wide CSS.

---

## Other Root-Level Files

- **`.env`**
  - Environment variables such as `NEXT_PUBLIC_BACKEND_API_URL`.
  - Should remain out of version control if containing sensitive data.

- **`.gitignore`**
  - Lists files and folders that Git should ignore (e.g., `node_modules`, build output, `.env*`).

- **`components.json`**
  - Configuration file for the Shadcn UI generator (or similar). Defines style, rsc settings, aliases, etc.

- **`next.config.ts`**
  - Next.js configuration (e.g., ignoring build errors, image handling, and experimental features).

- **`package.json`**
  - Lists dependencies, scripts, and metadata for the project.

- **`postcss.config.mjs`**
  - Configures PostCSS (e.g., enabling TailwindCSS plugin).

- **`README.md`**
  - Project overview and instructions for local setup and usage.

---

## Execution Flow

1. The Next.js application starts at `app/layout.tsx`, which sets up global contexts and theming.  
2. `app/page.tsx` is the default landing page. Users can navigate to `/login`, `/employee`, or `/mobile` routes.  
3. `AuthContext` ensures correct user role-based access. `MeetingContext` handles meeting logic, while `SessionContext` handles session-based conversation settings.  
4. Components in `components/` and subdirectories supply UI and logic for chat, voice recording, and user flows.

---

**Last Updated**: Based on content provided. Feel free to extend or adjust this structure to fit your team’s conventions and best practices.