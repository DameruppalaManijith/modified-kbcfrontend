// import "@testing-library/jest-dom";
// import { render, screen, act } from "@testing-library/react";
// import Fastestfinger from "./FFF";
// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";
// import React from "react"
// const mock = new MockAdapter(axios);

// // Mock media element methods globally
// beforeAll(() => {
//   jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
//   jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
//   jest.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  
//   // Mock Audio constructor
//   window.Audio = class MockAudio {
//     constructor(src) {
//       this.src = src || 'mock-audio.mp3';
//       this.play = () => Promise.resolve();
//       this.pause = () => {};
//       this.load = () => {};
//     }
//   };
// });

// beforeEach(() => {
//   mock.reset();
//   // Mock API endpoints used in FFF.jsx
//   mock.onGet("http://localhost:5000/fffusercount").reply(200, { usercount: 1 });
//   mock.onGet("http://localhost:5000/getstart").reply(200, [{ startfff: 0 }]);
//   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(200, []);
// });

// test("renders Fastest Finger First page with basic elements", async () => {
//   await act(async () => {
//     render(<Fastestfinger />);
//   });

//   // Verify static headers
//   expect(screen.getByText("WELCOME!!! QUESTIONS WILL BE ASKED SOON")).toBeInTheDocument();

// });
import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import Fastestfinger from "./FFF";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { fireEvent } from "@testing-library/react";

const mock = new MockAdapter(axios);

jest.setTimeout(10000);
jest.useFakeTimers();
// Mock media element methods globally
beforeAll(() => {
  jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  jest.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => {});

  // Mock Audio constructor
  window.Audio = class MockAudio {
    constructor(src) {
      this.src = src || "mock-audio.mp3";
      this.play = () => Promise.resolve();
      this.pause = () => {};
      this.load = () => {};
    }
  };
});

beforeEach(() => {

  // Mock API endpoints used in FFF.jsx
  mock.onGet("http://localhost:5000/fffusercount").reply(200, { usercount: 1 });
});

test("renders Fastest Finger First page with basic elements", async () => {
  await act(async () => {
    render(<Fastestfinger />);
  });

  // Verify static headers
  expect(screen.getByText("WELCOME!!! QUESTIONS WILL BE ASKED SOON")).toBeInTheDocument();

});

test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(()=>{
        return [200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Paris",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]];
});
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(()=>{
        return [200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]];
});
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    screen.debug();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Paris"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Paris")).backgroundColor).toBe("green");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Paris",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("London"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("London")).backgroundColor).toBe("red");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Paris",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Berlin"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Berlin")).backgroundColor).toBe("red");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Paris",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Madrid"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Madrid")).backgroundColor).toBe("red");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "London",
            foptionB: "Paris",
            foptionC: "Berlin",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Paris"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Paris")).backgroundColor).toBe("green");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Berlin",
            foptionB: "London",
            foptionC: "Paris",
            foptionD: "Madrid",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Paris"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Paris")).backgroundColor).toBe("green");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Madrid",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Paris",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Paris"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Paris")).backgroundColor).toBe("green");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Madrid",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Paris",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 0 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("GET BACK2", {}, { timeout: 5000 });
    expect(questionElement).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getByText("Madrid"));
    });
    await waitFor(() => {
        expect(window.getComputedStyle(screen.getByText("Madrid")).backgroundColor).toBe("red");
    });
});
test("displays question when started", async () => {
    // Ensure mocks are defined before rendering
    mock.onGet("http://localhost:5000/getstart").reply(() => {
        console.log("ðŸ›  Mocked: getstart API called");
        return [200, [{ startfff: 1, questionid: 1 }]];
    });

    mock.onGet("http://localhost:5000/fetchfffquestion").reply(
        200, [{
            fquestion: "What is the capital of France?",
            foptionA: "Madrid",
            foptionB: "London",
            foptionC: "Berlin",
            foptionD: "Paris",
            fanswer: "Paris"
        }]
    );
   mock.onGet("http://localhost:5000/getfffplayerinfo").reply(
        200,[
            {
                id: 1,
                name: "Manijith",
                email:"chinnu2nd@gmail.com",
                time:0,
                correctanswers:0,
                answered: 0

            }
        ]
   );
    mock.onGet("http://localhost:5000/fffusercount").reply(()=>{
        return [200, [{ count: 1 }]]
});
    mock.onGet("http://localhost:5000/fetchvalue").reply(()=>{
        return [200, [{ value: 1 }]]});
    mock.onGet("http://localhost:5000/fetchwinner").reply(()=>{
        return [200, [{ winner: "Player1" }]]});
    mock.onGet("http://localhost:5000/setbackvalue").reply(()=>{
        return [200, [{ status: "ok" }]]});

    mock.onPost("http://localhost:5000/inserttimecorrect").reply(()=>{
        return [200, [{ success: true }]]
});
    mock.onPost("http://localhost:5000/getbackfromfff").reply(()=>{
        return [200, [{ success: true }]]});

  

    // Render the component
    await act(async () => {
        render(<Fastestfinger />); 
    });
    // Wait for the interval to trigger API call
    const questionElement = await screen.findByText("PLAY GAME", {}, { timeout: 5000 });
    expect(screen.getByText("Instructions")).toBeInTheDocument();
    expect(screen.getByText("GET BACK")).toBeInTheDocument();
});


  