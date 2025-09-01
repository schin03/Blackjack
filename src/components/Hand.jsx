import Card from "./Card.jsx";
import React, { useState, useEffect, useRef } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";

export default function Hand({ gameStarted, cards, active, onFinish }) {
    const [totalValue, setTotalValue] = useState(0);
    const [hand, setHand] = useState(cards);
    const [play, setPlay] = useState(active);

    const finished = useRef(false);


    // perform hit
    const hit = () => {
        const card = makeCard(hand.length);
        const updatedHand = [...hand, card];
        setHand(updatedHand);
    };

    // perform stand
    const stand = () => {
        setPlay(false);
        finished.current = true;
        onFinish(["stand", hand]);
    };

    const bust = () => {
        setPlay(false);
        finished.current = true;
        onFinish(["bust", hand]);
    }

    // inital update to display hand and content
    useEffect(() => {

        let currHand = cards;

        // detect initial bj
        if (!finished.current && currHand.length === 2 && calculateValue(currHand) === 21) {

            setPlay(false);
            finished.current = true;
            setHand(currHand);
            setTotalValue(21);
            onFinish(["bj", currHand]);

        } else {
            // rerender updated hand
            setPlay(active);
            setHand(cards);
            finished.current = false;
        }
    }, [active, cards]);


    // detect bust
    useEffect(() => {
        if (totalValue > 21) {
            bust();
        }
    }, [totalValue]);


    // count the total for the hand
    useEffect(() => {
        if (finished.current) return;

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

    }, [hand, onFinish, cards]);

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
