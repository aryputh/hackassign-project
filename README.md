## HackAssign
This hackassign project utilizes c#, Judge0, supabase, and other elements to build a website that allows teachers to come together and configure coding problems in an environment where the student can compile and post code all in the same space. The user will be able to log in as either a teacher or student which depending on their role, will have access to different features on the dashboard such as assignment creation, submissions, and class management.

### Project Members
1. Carsyn Favorite (Team Lead)
    - Formatting pages using html and css.
2. Aryan Puthran
    - Setup and managing Supabase.
3. James Abitria
    - Setup and managing Judge0.

### Built With
  - [Firebase Hosting](https://firebase.google.com/docs/hosting)
    - Hosting the website.
  - [Supabase Database](https://supabase.com/)
    - Hosting the database tables, managing permissions, and security.
  - [Judge0](https://https://judge0.com/.com/)
    - Compiling and running code the user writes.
  - [React.js](https://react.dev/)
    - Used to create webpages, setup redirecting, and page functionality.
   
### Setup Instructions
Clone the repository
```
git clone https://github.com/your-username/hackassign.git
cd hackassign
```

Install Frontend Dependencies
- Ensure you have Node.js installed.
- Then install all NPM packages:
```
npm install
```

Install Axios (for API calls)
- Axios is used to communicate with Judge0 and other APIs:
```
npm install axios
```

Environment Variables Setup
- Create a file in the root of your project: .env.local
- Inside the .env.local, add the following keys:
    - Supabase keys
      - NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    - Judge0 API
      - NEXT_PUBLIC_JUDGE0_URL=https://judge0.p.rapidapi.com
      - NEXT_PUBLIC_RAPIDAPI_KEY=your-rapidapi-key

Database Setup
- Go to Supabase and create a new project.
- Set up your tables.
- Enable Row Level Security (RLS) rules if necessary.
- Get your Project URL and Anon Key for the environment variables.

Running the Application
- Start the frontend:
```
cd frontend
npm start
```
- Now the app should be running at: [http://localhost:3000](http://localhost:3000)

Additional Notes
- Make sure your Supabase auth rules allow different roles (teachers, students) to have appropriate access levels.
- Judge0 requires a RapidAPI key, free plans have execution limits.
