import Hand from "./Hand.jsx";
import React, { useState, useEffect, useRef } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";
export default function Player({
    gameStarted,
    initialHands,
    splitChoice,
    onFinish,
    playable
}) {
    const [currHand, setCurrHand] = useState(0);
    const [hands, setHands] = useState(initialHands);

    const splitResults = useRef([]);

    // Cycles through current hands, passes results after player finishes
    const finishCurrentHand = (resultArray, index) => {
        if (splitChoice) {
            if (index === 0) {
                splitResults.current = [resultArray];
                setCurrHand(1);
                const newHands = [resultArray[1], hands[1]];
                setHands(newHands);
            } else {
                splitResults.current.push(resultArray);
                const newHands = [hands[0], resultArray[1]];
                onFinish(splitResults.current);
            }
        } else {
            onFinish([resultArray]);
        }

    };

    // Refreshes Player on new hand
    useEffect(() => {
        setCurrHand(0);
        setHands(initialHands);
        splitResults.current = [];
    }, [initialHands]);

    // Splitting logic
    useEffect(() => {
        if (splitChoice && initialHands.length === 1) {
            const [card1, card2] = initialHands[0];
            const newHands = [
                [card1, makeCard(1)],
                [card2, makeCard(1)]
            ];
            setHands(newHands);
            setCurrHand(0);
            splitResults.current = [];
        } else {
            setHands(initialHands);
        }

    }, [splitChoice, initialHands]);


    return (
        <div className="player-section">
            <h3>Player's Hand</h3>
            {hands.map((hand, index) => {
                const handClass = hands.length === 2 ? `hand hand-${index}` : "hand hand-single";
                return (
                    <div className={handClass} key={index}>
                        <Hand
                            gameStarted={gameStarted}
                            key={index}
                            cards={hand}
                            active={index === currHand && playable}
                            onFinish={(resultArray) => { finishCurrentHand(resultArray, index) }}
                        />
                    </div>

                );
            })}
        </div>

    );

}
