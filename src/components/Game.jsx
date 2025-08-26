import React, { useEffect, useState } from "react";
import { makeCard, calculateValue } from "../utils/Card.js";
import Insurance from "./Insurance.jsx";
import Split from "./Split.jsx";
import Dealer from "./Dealer.jsx";
import Player from "./Player.jsx";

export default function Game() {

    // game running
    const [gameStart, setGameStart] = useState(false);

    // hands
    const [hands, setHands] = useState([[]]);
    const [dealerHand, setDealerHand] = useState([]);

    // insurance
    const [insuranceOption, setInsuranceOption] = useState(false); // pop up option
    const [insurance, setInsurance] = useState(false);

    // split
    const [splitOption, setSplitOption] = useState(false); // pop up option
    const [split, setSplit] = useState(false);

    //   function delay(ms) {
    //     return new Promise((resolve) => setTimeout(resolve, ms));
    //   }

    const startGame = () => {
        resetGame();
        dealCards();
    };

    const resetGame = () => {   
        setDealerHand([]);
        setHands([]);
        insuranceSetter(false);
        splitSetter(false);
    };

    const dealCards = () => {
        let hands = [];
        let dealerHand = [];
        let playerHand = [];

        const card = makeCard(1);
        card.flipped = false;

        for (let i = 0; i < 4; i++) {
            if (i === 3) {
                dealerHand = [...dealerHand, card];
                setDealerHand(dealerHand);
            } else if (i % 2 === 0) {
                playerHand = [...playerHand, makeCard(playerHand.length)];
            } else {
                dealerHand = [...dealerHand, makeCard(dealerHand.length)];
                setDealerHand(dealerHand);
            }
        }

        playerHand = [makeCard(0), makeCard(0)];

        // dealerHand = [makeCard(0), makeCard(9)];
        // setDealerHand(dealerHand);

        hands.push(playerHand);
        setHands(hands);
        runScenario(hands, dealerHand);
    };

    const runScenario = (hands, dealerHand) => {
        const hand = hands[0];

        if (dealerHand[0].id === 1) {
            setInsuranceOption(true);
            console.log(dealerHand);
            if (calculateValue(dealerHand) === 21)
                console.log("dealer bj");
        }

        if (calculateValue(hands[0]) === 21) {
            console.log(hands[0]);
            console.log("player bj");
        } else if (hand[0].id === hand[1].id) {
            setSplitOption(true);
            console.log(hands[0]);
            console.log("player split potential");
        } else {
            console.log(hands);

        }
    };

    const handlePlayerDone = (results) => {

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
            <Dealer cards={dealerHand} />
            <Player initialHands={hands} playerDone={handlePlayerDone} splitChoice={split}/>
            {insuranceOption && (
                <Insurance active={insuranceOption} insuranceSet={insuranceSetter} />
            )}
            {splitOption && <Split active={splitOption} splitSet={splitSetter} />}
        </div>
    );
}
