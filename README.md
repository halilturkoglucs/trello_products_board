# Trello Board using ReactJS

This project has react-starter-app using an assumed backend eg. data generating Express web app.

## Dependencies

Node >= 8.10
npm >= 5.6

## How to install

Run `npm install` to pull in all dependencies.

## How to run

First run the backend folder with `npm start`. This will start the backend data generator (as-is from the coding test).
Then cd into frontend and the following commands will be helpful to you:

- `npm run start` - starts the server in development mode at http://localhost:3000.
- `npm run test`  - runs the tests.
- `npm run test:debug` - runs the test in debug mode
- `npm run build` - builds for an optimized production build.

## How it works

The application uses the coding test app as an as-is backend REST server and makes
calls to it to display the data using React.JS components.

## Getting started

Run `npm run start` and navigate to http://localhost:3000 to see the landing page.

## Features
Below I describe how I implemented the below features:

1. For each product the `/products` REST endpoint returns, render a column.
Having made a REST call to the endpoint, I list them into a table and for each product, I enquire its customers by the relevant endpoint.

2. For each column, render the customers for that product.
I render the customers with the other fields as shown in the mockup.

3. If the user types in the search bar, the UI should do one of:
   - Only show customers whose names or quotes match what was searched for, or
   - Highlight the text that matches, or
   - Both! ;)
   
I included a select component to choose if you want to only show the ones matched or
highlight the text matched. For highlight mode, it searches in everything ie. product name, customer name, job info and quote. Since the highlighted search is case-insensitive,
when a match is found, it shows the match as search (eg. customer name is Adil Ozeren, search text is 'adil', then in the page, the highlighted text becomes 'adil Ozeren')
For search mode, it also searches in those areas and shows only the products/customers matching. If the searched text appears in Product Name, then the whole list of customers loaded on the page are shown, if it appears
in a customer but not in the product name; then only matching customers are listed and others are hidden.
Since the page shows a limited number of customers per product (7 by default), in order to search/highlight in more customers; please click 'Load More'.

PS: The search and highlight mode is case insensitive.

4. For each product, poll the customer REST endpoint every 30 seconds and update the UI with the new customer data.
For this dynamic feature, I chose to include Redux as it is a structured way to distribute
the new customers as a new state to the React components and reflect the changes dynamically and then scheduled an interval function to trigger data poll.

5. Right now, if the browser width is small, product columns wrap under eachother. Refactor the CSS so that all product columns are displayed in a single horizontal row - like a Trello board or agile card board would be rendered.
I used Grid layout with auto scaling (using minmax) to have a responsive grid layout. When you change browser's window size, the products' and customers' data will resize accordingly.

## How I implemented the solution

As I aimed to come up with a structured and standard response to this, I chose to
go with React Starter template which is an excellent starter point to prototype quickly.

Since this app uses starter template, it supports all the latest modern browsers.
For more details about compatibility, please check: [here](https://create-react-app.dev/docs/supported-browsers-features/)

The starter app uses REST requests and they are asynchronous handled by Thunk.
The application tries to implement KISS and SOLID principles.

I've used ReactJS, Redux, Thunk, HTML, SASS, React-Bootstrap as the main framework and libraries. Bootstrap provides the responsive design of the app.

## Improvement Areas

 - The application code definitely can benefit from more unit, integration tests as well as load and behaviour tests. 
 - Multilingual and routing capabilities can be added.
 - Environment separation like the backend URL per environment (eg. DEV, UAT, PROD) may be added.
 - Some functions like highlight might have been moved to a util class and exported from there.
 - Docker support could be added.
 - Docker & CLI integration may be made for automatic CI & CD via a Git repository. Ultimately, these can be deployed to a staged environment eg. AWS/Azure/Google Cloud

## References

Here I list the references I benefited from while developing this app to give the necessary credit to them.

1. https://reactjs.org/docs/create-a-new-react-app.html#create-react-app
2. https://create-react-app.dev/docs/supported-browsers-features/
3. https://react-bootstrap.github.io/components/table/
4. https://redux.js.org/recipes/writing-tests
5. https://create-react-app.dev/docs/debugging-tests/
