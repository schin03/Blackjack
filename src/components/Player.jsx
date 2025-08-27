import Hand from "./Hand.jsx";
import React, { useState, useEffect } from "react";
import { makeCard } from "../utils/Card.js";
export default function Player({ initialHands, splitChoice }) {
  const [currHand, setCurrHand] = useState(0);
  const [hands, setHands] = useState(initialHands);

  const finishCurrentHand = () => {
    if (currHand < hands.length) {
      setCurrHand(currHand + 1);
    }
  };

  useEffect(() => {
    setHands(initialHands);
  }, [initialHands]);

  useEffect(() => {
    if (splitChoice && hands.length === 1) {
      let hand1 = [hands[0][0], makeCard(1)];
      let hand2 = [hands[0][1], makeCard(1)];
      let splitHand = [hand1, hand2];
      setHands(splitHand);
    }
  }, [splitChoice]);

  if (splitChoice) {
    return (
      <div>
        <div className="player-section">
          <h2>Splitted</h2>
          {hands.map((hand, index) => {
            return (
              <Hand
                key={index}
                cards={hand}
                active={index === currHand}
                onFinish={finishCurrentHand}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="player-section">
          <h2>Player's Hand</h2>
          <Hand cards={hands[0]} active={true} onFinish={finishCurrentHand} />
        </div>
      </div>
    );
  }
}
