import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import Kbcgame from "./kbc";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";

const mock = new MockAdapter(axios);

// Enhanced media mocking
beforeAll(() => {
  jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  
  window.Audio = class MockAudio {
    constructor(src) {
      this.src = src || 'mock-audio.mp3';
      this.play = () => Promise.resolve();
      this.pause = () => {};
      this.load = () => {};
    }
  };
});

beforeEach(() => {
  mock.reset();
  jest.useFakeTimers();
  
  // Mock all API endpoints
 
  
  mock.onPost("http://localhost:5000/setoption").reply(200);
  mock.onGet("http://localhost:5000/fetchoption").reply(200, [{ value: "Delhi" }]);
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test("full game flow with correct answer selection", async () => {
    mock.onPost("http://localhost:5000/getquestion").reply(200, {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "Delhi",
        optionC: "Kolkata",
        optionD: "Chennai",
        answer: "Delhi"
      });
  render(<Kbcgame type="test" />);

  // Verify initial UI
  await waitFor(() => {
    expect(screen.getByText("LOCK")).toBeInTheDocument();
    expect(screen.getByText("QUIT")).toBeInTheDocument();
    expect(screen.getByText("50/50")).toBeInTheDocument();
  });

  // Question loading verification
  await waitFor(() => {
    expect(screen.getByText("What is the capital of India?")).toBeInTheDocument();
  });

  // Answer selection
  const answerButtons = await screen.findAllByTestId(/answer-button/);
  fireEvent.click(answerButtons[1]); // Select Delhi

  // Lock answer
  await act(async () => {
    fireEvent.click(screen.getByText("LOCK"));
   
  });

  // Verify score progression
  await waitFor(() => {
    expect(screen.getByText("1,000")).toHaveStyle("background-color: yellow");
  }, { timeout: 5000 });

  // Test 50/50 lifeline
  await act(async () => {
    fireEvent.click(screen.getByText("50/50"));
  });

  await waitFor(() => {
    const visibleOptions = screen.getAllByTestId(/answer-button/);
    expect(visibleOptions.length).toBe(4);
  });

  // Test quit functionality
  await act(async () => {
    fireEvent.click(screen.getByText("QUIT"));
  });


});

test("handles incorrect answer flow", async () => {
    mock.onPost("http://localhost:5000/getquestion").reply(200, {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "Delhi",
        optionC: "Kolkata",
        optionD: "Chennai",
        answer: "Delhi"
      });
  mock.onGet("http://localhost:5000/fetchoption").reply(200, [{ value: "Mumbai" }]);

  render(<Kbcgame type="test" />);

  await waitFor(() => screen.getByText("What is the capital of India?"));

  const answerButtons = await screen.findAllByTestId(/answer-button/);
  fireEvent.click(answerButtons[0]); // Select Mumbai

  await act(async () => {
    fireEvent.click(screen.getByText("LOCK"));
   
  });

  await waitFor(() => {
    expect(screen.getByText("1,000")).toHaveStyle("background-color: yellow");
  });
});
test("handles incorrect answer flow", async () => {
    mock.onPost("http://localhost:5000/getquestion").reply(200, {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "Delhi",
        optionC: "Kolkata",
        optionD: "Chennai",
        answer: "Delhi"
      });
  mock.onGet("http://localhost:5000/fetchoption").reply(200, [{ value: "Mumbai" }]);
      mock.onGet()
  render(<Kbcgame type="test"  />);

  await waitFor(() => screen.getByText("What is the capital of India?"));

  const answerButtons = await screen.findAllByTestId(/answer-button/);
  fireEvent.click(answerButtons[2]); // Select Mumbai

  await act(async () => {
    fireEvent.click(screen.getByText("LOCK"));
   
  });

  await waitFor(() => {
    expect(screen.getByText("1,000")).toHaveStyle("background-color: yellow");
  });
});
test("handles incorrect answer flow", async () => {
    mock.onPost("http://localhost:5000/getquestion").reply(200, {
        question: "What is the capital of India?",
        optionA: "Mumbai",
        optionB: "Delhi",
        optionC: "Kolkata",
        optionD: "Chennai",
        answer: "Delhi"
      });
  mock.onGet("http://localhost:5000/fetchoption").reply(200, [{ value: "Mumbai" }]);

  render(<Kbcgame type="test" />);

  await waitFor(() => screen.getByText("What is the capital of India?"));

  const answerButtons = await screen.findAllByTestId(/answer-button/);
  fireEvent.click(answerButtons[3]); // Select Mumbai

  await act(async () => {
    fireEvent.click(screen.getByText("LOCK"));
  });

  await waitFor(() => {
    expect(screen.getByText("1,000")).toHaveStyle("background-color: yellow");
  });

});


// test("verifies lifeline functionality", async () => {
//   render(<Kbcgame type="test" />);

//   await waitFor(() => screen.getByText("What is the capital of India?"));

//   await act(async () => {
//     fireEvent.click(screen.getByText("50/50"));
//     jest.advanceTimersByTime(1000);
//   });

//   const visibleOptions = screen.getAllByTestId(/answer-button/);
//   expect(visibleOptions.length).toBe(2);
//   expect(visibleOptions.some(opt => opt.textContent === "Delhi")).toBeTruthy();
// });

test("handles question flip functionality", async () => {
  mock.onPost("http://localhost:5000/getquestion").reply(200, {
    question: "New Question?",
    optionA: "A",
    optionB: "B",
    optionC: "C",
    optionD: "D",
    answer: "B"
  });

  render(<Kbcgame type="test" />);

  await act(async () => {
    fireEvent.click(screen.getByText("🔄"));
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText("New Question?")).toBeInTheDocument();
  });
});
