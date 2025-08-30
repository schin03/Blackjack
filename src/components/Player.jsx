import Hand from "./Hand.jsx";
import React, { useState, useEffect, useRef } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";
export default function Player({
    gameStarted,
    initialHands,
    splitChoice,
    onFinish,
}) {
    const [currHand, setCurrHand] = useState(0);
    const [hands, setHands] = useState(initialHands);

    const finishedHands = useRef(new Set());

    // Cycles through current hands, passes results after player finishes
    const finishCurrentHand = (resultArray, index) => {
        if (finishedHands.current.has(index)) return;

        finishedHands.current.add(index);
        
        if (splitChoice && currHand < hands.length-1) {
            setCurrHand(currHand +1);
        } else {
            onFinish(resultArray);
            setCurrHand(0);
            finishedHands.current.clear();
        }

    };

    // Refreshes Player on new hand
    useEffect(() => {
        setCurrHand(0);
        setHands(initialHands);
        finishedHands.current.clear();
    }, [initialHands]);

    // Splitting logic
    useEffect(() => {
        if (splitChoice && hands.length === 1) {
            let hand1 = [hands[0][0], makeCard(1)];
            let hand2 = [hands[0][1], makeCard(1)];
            setHands([hand1, hand2]);
        }
        
    }, [splitChoice, hands]);

    return(
        <div className="player-section">
            <h2>{splitChoice ? "Splitted Hands" : "Player's Hand"}</h2>
            {hands.map((hand, index)=> {
                <Hand
                    key={index}
                    gameStarted={gameStarted}
                    cards={hand}
                    active={index===currHand}
                    onFinish={(resultArray) => {finishedCurrentHand(resultArray, index)}}
                    />
            })}
        </div>
    );
}
