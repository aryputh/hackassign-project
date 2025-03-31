# Sprint 2 Report 
Video Link: INSERT
## What's New (User Facing)
 * Compiling of programs
 * Checking against test cases
 * Small styling issue fixes

## Work Summary (Developer Facing)
This sprint, we successfully integrated the Judge0 compiler API, allowing users to execute and evaluate code submissions within the platform. We also introduced a dynamic language selection feature, enabling users to pick their programming language. Additionally, we improved test case management by enforcing role-based permissions for instructors and enhanced UI responsiveness. Another major milestone was displaying Judge0’s runtime environment, which provides users with clear execution steps. Several bugs were addressed, including fixing the test case refresh issue and refining role-based access control. Overall, this sprint was a success, and we are prepared for the next sprint!

## Unfinished Work
We were able to finish everything we wanted to for the second sprint.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
 * [US03-1 Add test cases to assignments](https://github.com/aryputh/hackassign-project/issues/19)
 * [US03-3 Display Judge0 Runtime Environment on Main App](https://github.com/aryputh/hackassign-project/issues/9)
 * [Add Dropdown Menu for Changing Programming Language](https://github.com/aryputh/hackassign-project/issues/33)
 
 ## Incomplete Issues/User Stories
  Every issue we set out to complete was done by the end of sprint 2.

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [Dashboard.js](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/Dashboard.js)
 * [AssignmentPage.js](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/pages/AssignmentPage.js)
 * [TestCasePopup.js](https://github.com/aryputh/hackassign-project/blob/main/frontend/src/components/TestCasePopup.js)
 
## Retrospective Summary
Here's what went well:
 * Adding Compiler API
    * Implementing the compiler API was a significant milestone. The integration of Judge0 allowed us to execute and evaluate code submissions dynamically. This feature enables real-time code execution, helping users test their solutions without leaving the platform.
 * Allowing Users to Choose Their Language
    * Giving users the ability to select a programming language was crucial for flexibility. This feature ensures that users can work in their preferred language when solving assignments or running test cases.
 * Displaying Judge0 Runtime Environment in the Main App
    * Providing visibility into the runtime environment helps users understand execution constraints and metrics.
 
Here's what we'd like to improve:
 * More Robust Error Handling in the Compiler API
    * While the API integration is functional, error handling can be improved to cover edge cases like timeouts, syntax errors, and large inputs/outputs.
 * Enhancing UI for Language Selection
    * Currently, the language selection dropdown works but could be more intuitive.
    * Adding tooltips for supported languages
    * Displaying a default language based on past selections
    * Improving mobile responsiveness
 * Performance Optimization for Code Execution
    * As more users interact with the platform, performance optimizations are needed.
  
Here are changes we plan to implement in the next sprint:
   * Fully implement Judge0 compiling and results
   * Analytics at different levels
   * Fully styled system
