import React, { useState, useEffect } from "react";

function UseEvent() {

  const [count, setCount] = useState(0);
  const[ text,setText] = useState("");

  console.log("this is text event");

  useEffect(() => {
    console.log("count update", count);
  },[]);

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
       <p>{text}</p>
      <input type="text" onChange={(e) => setText(e.target.value)}/>
 


    </div>
  );
}

export default UseEvent;