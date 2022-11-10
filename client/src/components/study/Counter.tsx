import React, { useState } from "react";
import Button from "@mui/material/Button";
type Props = {};
type Istate = {
  counter: number;
};

const Counter = (props: Props) => {
  const [state, setState] = useState<Istate>({
    counter: 0,
  });

  const onIncrement = () => {
    setState({
      counter: state.counter + 1,
    });
  };

  const onDecrement = () => {
    setState({
      counter: state.counter - 1,
    });
  };

  return (
    <div>
      <h2>카운터</h2>
      <div>{state.counter}</div>
      <div>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
      </div>
    </div>
  );
};

export default Counter;
