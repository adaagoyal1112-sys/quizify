import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import "./quiz.css";
import Timer from "../components/Timer.jsx";
import { timerReturn } from "../context/timerReturn.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quiz = () => {
  const navigate = useNavigate();
  const [timerStopReturn, setTimerStopReturn] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [list, setList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [apifetch, setApifetch] = useState([])

  useEffect(() => {
    if (timerStopReturn) {
      setSubmit(true);
    }
  }, [timerStopReturn]);

// const fetchQuestions = async ()=>{
//   try {
//     const responce = await axios.get('https://quizapi.io/api/v1/questions',{
//       params:{
//         apiKey: 'B3dPEvWBEXgmHI92AmfJZOGbOOzH6INfdoTGTsrO'
//       }
//     });
//     console.log(responce.data);
//     setApifetch(responce.data)
//   } catch (error) {
//     console.error("error fetching quiz questions: ",error);
    
//   }
// }

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await axios.get("https://quizapi.io/api/v1/questions", {
        params: {
          apiKey: "B3dPEvWBEXgmHI92AmfJZOGbOOzH6INfdoTGTsrO",
        },
      });

      console.log("API Response: ", response.data); // ✅ This should now log correctly

      const formattedQuestions = response.data.map((item) => {
        const options = Object.values(item.answers).filter(
          (option) => option !== null
        );

        const correctIndex = Object.values(item.correct_answers).findIndex(
          (val) => val === "true"
        );

        return {
          Question: item.question,
          options: options,
          ans: options[correctIndex], // Correct answer from options
        };
      });

      console.log("Formatted Questions: ", formattedQuestions); // ✅ Now this will log correctly

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error fetching quiz questions: ", error);
    }
  };

  fetchQuestions();
}, []);

  const handleSubmit = () => {
    if (submit) {
      let updatedScore = score;
      if (selectedOption === questions[currentIndex].ans) {
        updatedScore += 10;
        setScore(updatedScore);
      }

      setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          localStorage.setItem("lastTotalScore", questions.length * 10);
          localStorage.setItem("lastScore", updatedScore);

          const currentDate = new Date();
          const time = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const day = currentDate.getDate();
          const month = currentDate.toLocaleString('default', { month: 'long' });
          const year = currentDate.getFullYear();
          const formattedDate = `${time}, ${day} ${month} ${year}`;
          const listObject = {formattedDate,updatedScore,totalScore}
          const updatedList = [...list, listObject];
          localStorage.setItem("list", JSON.stringify(updatedList));

          navigate("/scorelist");
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setSubmit(false);
          setSelected(null);
          setSelectedOption(null);
        }
      }, 100);
    } else {
      setSubmit(true);
    }
  };

  const handleSelect = (index) => {
    setSelected(index);
    setSelectedOption(questions[currentIndex].options[index]);
  };

  const question = questions[currentIndex] || {};
  const options = question.options || [];
  const totalScore = questions.length * 10;

  return (
    <timerReturn.Provider
      value={{ timerStopReturn, setTimerStopReturn, submit }}
    >
      <Navbar out />
      <div className="main-cont h-[calc(100vh-60px)] w-[100vw] flex justify-center items-center">
        <div className="inn-cont h-full w-[50%] flex flex-col px-[10px] py-[20px] items-center gap-[1%] justify-center">
        {questions.length === 0 ? (
          <p>Loading questions...</p>
        ) : (
          <>
          <div className="qno font-bold uppercase text-[1.5rem] h-[6%]">{`Question No. ${
            currentIndex + 1
          }`}</div>
          <div
            className="question w-full px-[7%] pl-0 h-[25%] items-end overflow-y-scroll flex scrollbar mb-[5px]"
          >
            {`Q. ${question.Question}`}
          </div>
          <div className="options w-full h-[50%] py-[10px] flex flex-col justify-between px-[10px]">
            {options.map((option, index) => {
              let baseClass =
                "option text-black p-[5px] flex justify-center items-center h-[22%] w-[80%] rounded-full cursor-pointer relative ";

              if (submit) {
                if (option === question.ans) {
                  baseClass += " bg-green-700";
                } else if (selected === index) {
                  baseClass += " bg-red-500";
                } else {
                  baseClass += " bg-gray-400";
                }
              } else {
                baseClass +=
                  selected === index
                    ? " bg-yellow-500 left-[10%]"
                    : " bg-gray-400 hover:bg-gray-500 transition-options";
              }

              return (
                <button
                  key={index}
                  onClick={() => (submit ? null : handleSelect(index))}
                  className={baseClass}
                  disabled={submit}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="btn-timer w-full h-[18%] flex px-[10px] justify-between items-center">
            <div className="timer h-full flex items-center gap-[5px]">
              <div className="gif h-[70%]">
                <img src="clock.gif" alt="" className="h-[100%]" />
              </div>
              <div className="count">
                <Timer time="60" />
              </div>
            </div>
            <button
              className="submit bg-gray-500 text-white p-[7px] rounded-full shadow-black shadow-1"
              onClick={handleSubmit}
            >
              {submit
                ? currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next"
                : "Submit"}
            </button>
            <div className="score">{`${score}/${totalScore}`}</div>
          </div>
          </>
        )}
        </div>
      </div>
    </timerReturn.Provider>
  );
};

export default Quiz;
