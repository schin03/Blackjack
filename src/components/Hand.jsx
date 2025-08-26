import Card from "./Card.jsx";
import React, { useState, useEffect } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";


export default function Hand({ cards, setComplete }) {
    const [totalValue, setTotalValue] = useState(0);
    const [hand, setHand] = useState(cards);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setHand(cards);
    }, [cards]);

    const hit = () => {

        const card = makeCard(hand.length);
        const updatedHand = [...hand, card];
        setHand(updatedHand);
        console.log(updatedHand);
        if (calculateValue(updatedHand) > 21) {
            setComplete({ status: "bust", total: calculateValue(updatedHand) });
            setDone(true);
        }
    }

    const stand = () => {
        setComplete({ status: "stand", total: calculateValue(hand) });
        setDone(true);
    }

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
        console.log(hand);
    }, [hand]);

    return (
        <div>
            <div className="card-value">Value: {totalValue}</div>
            <div className="card-container">
                {hand.map((card, index) => {
                    return (
                        <Card
                            key={index}
                            text={card.text}
                            flipped={card.flipped}
                        />
                    );

                })}
            </div>
            {!done && (
                <div className="player-options">
                    <button onClick={hit}>hit</button>
                    <button onClick={stand}>stand</button>
                </div>
            )}

        </div>
    )
}
