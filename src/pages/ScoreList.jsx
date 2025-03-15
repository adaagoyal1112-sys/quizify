import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from "../components/Navbar.jsx"
import "./shadow.css"
const ScoreList = () => {
  const [currentScore, setCurrentScore] = useState(0)
  const [currentTotalScore, setCurrentTotalScore] = useState(0)
  const [list, setList] = useState([])
  
  
  

  useEffect(() => {
  
    setCurrentScore(localStorage.getItem("lastScore"))
    setCurrentTotalScore(localStorage.getItem("lastTotalScore"))
    const data = localStorage.getItem("list")
    setList(JSON.parse(data))
  }, [])

  const toHomepage = () => {
   window.location.href="/homepage"
  }
  
  return (
    <>
      <Navbar/>
      <div className="cont h-[calc(100vh-60px)] flex relative justify-center items-center ">
        <div className="home p-[5px] rounded-[3px] uppercase font-bold bg-white absolute top-[10px] left-[10px] border hover: border-opacity-[50%] flex justify-center items-center shadow cursor-pointer" onClick={toHomepage}>Back to homepage</div>

        <div className="innerCont h-[80vh] w-[50vw]  shadow1 flex flex-col justify-between p-[10px]"> 
          <div className="currentScore w-full h-[40%] bg-red-50 p-[10px] flex flex-col items-center">
            <div className='text-[22px] font-bold'>Your Score</div>
            <div className='text-[5rem]'>{`${currentScore}/${currentTotalScore}`}</div>
          </div>
          <div className="prevScore w-full h-[57%] bg-blue-50 p-[10px] overflow-y-scroll">
            <div className="header flex justify-between mb-[20px] border-b-[2px] border-gray-400"><div>Score</div> <div>Time</div></div>
            {list?.map((item,index)=>{
              return(
                <div key={index} className=' justify-between flex'><div>{`${item.updatedScore}/${item.totalScore}`}</div><div>{item.formattedDate}</div></div>
              )
            })}
          </div>
        </div>

      </div>
    </>
  )
}

export default ScoreList
