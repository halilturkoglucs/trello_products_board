import {render, screen} from '@testing-library/react';
import App from './App';
import store from "./store";
import React from "react";
import {Provider} from "react-redux";

test('renders the header', () => {
  render(
    <Provider store={store}>
      <App/>
    </Provider>
  );
  const linkElement = screen.getByText(/Products/i);
  expect(linkElement).toBeInTheDocument();
});
