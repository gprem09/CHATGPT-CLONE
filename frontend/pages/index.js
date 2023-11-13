import React from 'react'
import { useState, useEffect } from 'react'

const index = () => {

  const [message, setMessage] = useState("Loading")
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/home").then(
      (response) => response.json()
    ).then(
      (data) => {
        setMessage(data.message);
        setPeople(data.people);
        console.log(data.people);
      }
    );
  }, []);

  return (
    // <div>
    //   <div>{message}</div>
      
    //   {
    //     people.map((person, index) => (
    //       <div key={index}>
    //         {person}
    //       </div>
    //     ))
    //   }
    // </div>

    <main className='min-h-screen bg-rgba'>

      <h1 className='text-xl'>PremGPT</h1>

      


    </main>
  )
}

export default index