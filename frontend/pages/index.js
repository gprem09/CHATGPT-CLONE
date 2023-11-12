import React from 'react'
import { useState, useEffect } from 'react'

const index = () => {

  const [message, setMessage] = useState("Loading")

  useEffect(() => {
    fetch("http://localhost:8080/api/home").then(
      response => response.json()
    ).then(
      data => {
        setMessage(data.message);
      }
    );
  }, []);

  return (
    <div>{message}</div>
  )
}

export default index