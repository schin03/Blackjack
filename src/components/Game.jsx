import React, { useEffect, useState } from "react";
import { makeCard } from "../utils/Card.js";
import Insurance from "./Insurance.jsx";
import Split from "./Split.jsx";
import Dealer from "./Dealer.jsx";
import Player from "./Player.jsx";

export default function Game() {
  const [hands, setHands] = useState([[]]);
  const [activeHand, setActiveHand] = useState(0);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);

  // insurance
  const [insuranceOption, setInsuranceOption] = useState(false);
  const [insurance, setInsurance] = useState(false);

  // split
  const [splitOption, setSplitOption] = useState(false);
  const [split, setSplit] = useState(false);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const startGame = () => {
    resetGame();
    dealCards();
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setHands([]);
  };

  const dealCards = async () => {
    let hands = [];
    let dealerHand = [];
    let playerHand = [];

    const card = makeCard(1);
    card.flipped = false;

    for (let i = 0; i < 4; i++) {
      await delay(500);
      if (i === 3) {
        dealerHand = [...dealerHand, card];
        setDealerHand(dealerHand);
      } else if (i % 2 === 0) {
        playerHand = [...playerHand, makeCard(playerHand.length)];
        setPlayerHand(playerHand);
      } else {
        dealerHand = [...dealerHand, makeCard(dealerHand.length)];
        setDealerHand(dealerHand);
      }
    }

    // playerHand = [makeCard(0), makeCard(0)];
    // setPlayerHand(playerHand);

    // dealerHand = [makeCard(0), makeCard(9)];
    // setDealerHand(dealerHand);

    hands.push(playerHand);
    setHands(hands);
    runScenario(hands, dealerHand);
  };

  const runScenario = (hands, dealerHand) => {
    const hand = hands[0];

    if (calculateValue(dealerHand) === 21) {
      setInsuranceOption(true);
      console.log(dealerHand);
      console.log("dealer bj");
    }

    if (calculateValue(hands[0]) === 21) {
      console.log(hands[0]);
      console.log("player bj");
    } else if (hand[0].value === hand[1].value) {
      setSplitOption(true);
      console.log(hands[0]);
      console.log("player split potential");
    } else {
      console.log(hands[0]);
      console.log("something else");
    }
  };

  // calculate total of given hand
  function calculateValue(cards) {
    let total = 0;
    let aceCount = 0;
    for (const card of cards) {
      if (card.flipped) {
        total += card.value;
        if (card.value === 1) aceCount++;
      }
    }

    return aceCount > 0 && total + 10 <= 21 ? total + 10 : total;
  }

  useEffect(() => {
    console.log(insurance);
  }, [insurance]);

  useEffect(() => {
    console.log(split);
  }, [split]);

  const insuranceSetter = (option) => {
    setInsurance(option);
    setInsuranceOption(false);
  };

  const splitSetter = (option) => {
    setSplit(option);
    setSplitOption(false);
  };

  return (
    <div>
      <button onClick={startGame}>Start Game</button>
      {insuranceOption && (
        <Insurance active={insuranceOption} insuranceSet={insuranceSetter} />
      )}
      {splitOption && <Split active={splitOption} splitSet={splitSetter} />}
      <Dealer cards={dealerHand} />
      {hands.length > 1 ? (
        hands.map((hand, index) => (
          <Player
            key={index}
            cards={hand}
            playerIndex={index}
            currHand={activeHand}
          />
        ))
      ) : (
        <Player cards={hands[0]} playerIndex={0} />
      )}
    </div>
  );
}
