# Sprint 1 Report 
Video Link: INSERT

## What's New (User Facing)
 * Users can create an account and login to the site.
 * Instructors can manage classes by adding/removing students, and editing, deleting, and creating classes.
 * Instructors can manage assignments by editing, creating, and deleting them.
 * Users can navigate from their dashboard to various pages (i.e. classes or assignments).
 * Integration with Supabase, Firebase Hosting, and React.js.

## Work Summary (Developer Facing)
We setup the foundations for our application by importing packages and linking them to properly communicate with one another. Three major components were required to make the application operational; creating the website UI, setting up databases to store user and assignment information, and a compiler for code to be run on. Carsyn was tasked with handling UI elements in the React app, Aryan built the databases utilizing Supabase, and James setup the Judge0 compiler. The difficulty of the project stemmed from working with an externally hosted app. Our team was very cautious regarding making changes to the main site, therefore many of the changes were tested on our local machines when possible. Given that these packages are new to our team, our changes would often be sent to Aryan to verify their functionality, as his work was geared towards linking up with the main website. In future sprints, we would like to continue the work in an incremental fashion, as many of these packages involved performing a lot of setup for a single contribution, and ideally the project should be built slowly over time with its features for manageability.

## Unfinished Work
* We finished everything we planned to furing this sprint.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
 * [US00-1 Use React Router to allow for the hosting of multiple pages](https://github.com/aryputh/hackassign-project/issues/4)
 * [US00-2 Create Supabase Tables with Attributes](https://github.com/aryputh/hackassign-project/issues/7)
 * [US00-3 Add Basic Text on Each Page](https://github.com/aryputh/hackassign-project/issues/6)
 * [US00-4 Setup row-level security (RLS) policies for access control](https://github.com/aryputh/hackassign-project/issues/10)
 * [US00-5 Add a Basic Way to Navigate Between Pages](https://github.com/aryputh/hackassign-project/issues/5)
 * [US00-6 Create a dashboard page](https://github.com/aryputh/hackassign-project/issues/11)
 * [US01/US02 Create login/register system](https://github.com/aryputh/hackassign-project/issues/13)
 * [US05-1 Add ability for instructors to create, delete, rename, and add users to classes](https://github.com/aryputh/hackassign-project/issues/16)
 * [US05-2 Allow users to view assignments](https://github.com/aryputh/hackassign-project/issues/17)
 * [US05-3 Allow instructors to manage assignments](https://github.com/aryputh/hackassign-project/issues/18)

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [Basic CSS Design](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/styles/global.css)
 * [Access Denied](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/AccessDenied.js)
 * [Assignment Page](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/AssignmentPage.js)
 * [Class Page](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/ClassPage.js)
 * [Dashboard Page](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/Dashboard.js)
 * [Manage Class Page](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/ManageClass.js)
 * [Welcome Page](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/Welcome.js)
 
## Retrospective Summary
Here's what went well:
* Our core features (listed above) were delivered, we figured out how to get Supabase connected and working with our platform, and defined user roles clearly. This allowed us to change what the user sees depending on their permissions. Using Supabase simplified authentication and database handling, which saved us some time.
 
Here's what we'd like to improve:
* Some things that didn’t go well were time estimation, handling state updates, and testing across different devices and environments.
    * Some tasks were more complex than we initially thought, which messed up our estimated effort numbers.
    * Since Supabase and Firebase setup was needed to get Judge0 working on the platform, we had issues getting it to work and testing it.
    * We plan to implement Judge0 fully by the end of the next sprint.
 
Here are changes we plan to implement in the next sprint:
* We created and planned multiple actionable items to improve our process and platform. The first was to improve time estimation, which we plan to do by timeboxing or breaking larger problems into smaller and more manageable chunks.
* Another action item is working on creating documentation for setting up the environment for new members. We could do this by making a setup guide, which allows new testers to test features without needing Firebase or Supabase. We can also document common issues and solutions.
* For the UI state problem, we discussed identifying and fixing areas where the UI doesn’t update correctly. We could also add loading indicators when waiting for the database updates to show in the interface.
* A solution for the Judge0 problem is to create a separate test project where users can input and run test cases without logging in. This would make testing easier without having to worry about all the setup. We could also send files to teammates for local testing instead of setting up the full project and dependencies.
* Another item is having more frequent code reviews. Instead of reviewing at the end of a sprint, we can add mid-sprint check-ins. This will allow us to catch potential and current issues before they build up and affect multiple parts of the application.
