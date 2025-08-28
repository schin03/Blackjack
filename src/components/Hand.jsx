import Card from "./Card.jsx";
import React, { useState, useEffect } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";

export default function Hand({ gameStarted, cards, active, onFinish }) {
  const [totalValue, setTotalValue] = useState(0);
  const [hand, setHand] = useState(cards);
  const [play, setPlay] = useState(active);

  // perform hit
  const hit = () => {
    const card = makeCard(hand.length);
    const updatedHand = [...hand, card];
    setHand(updatedHand);
  };

  // perform stand
  const stand = () => {
    setPlay(false);
    onFinish(["stand", hand]);
  };

  // inital update to display playable buttons
  useEffect(() => {
    setPlay(active);
  }, [active]);

  // inital update to display hand
  useEffect(() => {
    setHand(cards);
  }, [cards]);

  useEffect(() => {
    if (calculateValue(hand) === 21) {
      if (
        (hand[0].value === 1 && hand[1].value === 10) ||
        (hand[1].value === 1 && hand[0].value === 10)
      ) {
        setPlay(false);
        onFinish(["bj", hand]);
      }
    }
  }, [hand]);

  // count the total for the hand
  useEffect(() => {
    let total = 0;
    let aceCount = 0;
    let aceValue = 0;
    for (const card of hand) {
      if (card.flipped === true) {
        total += card.value;
        if (card.value === 1) aceCount++;

        if (aceCount > 0) {
          aceValue = total + 10;
        }
      }
    }
    aceValue < 21 && aceCount > 0
      ? setTotalValue(total + "," + aceValue)
      : aceValue === 21
      ? setTotalValue(21)
      : setTotalValue(total);

    if (total > 21 || aceValue > 21) {
      setPlay(false);
      onFinish(["bust", hand]);
    } else {
      setPlay(active);
    }
  }, [hand]);

  return (
    <div>
      <div className="card-value">Value: {totalValue}</div>
      <div className="card-container">
        {hand.map((card, index) => {
          return <Card key={index} text={card.text} flipped={card.flipped} />;
        })}
      </div>
      {gameStarted && play && (
        <div className="player-options">
          <button onClick={hit}>hit</button>
          <button onClick={stand}>stand</button>
        </div>
      )}
    </div>
  );
}
