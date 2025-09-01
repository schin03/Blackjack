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

    // game results
    const [showResults, setShowResults] = useState(false);
    const [resultText, setResultText] = useState("");

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
        setGameStart(false);
        setShowResults(false);
        setResultText("");
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

        // playerHand = [makeCard(0), makeCard(0)];

        // dealerHand = [makeCard(0), makeCard(9)];
        // setDealerHand(dealerHand);

        hands.push(playerHand);
        setHands(hands);
        runScenario(hands, dealerHand);
    };

    const runScenario = (hands, dealerHand) => {
        const hand = hands[0];
        setGameStart(true);
        if (dealerHand[0].id === 1) {
            // fix insurance
            setInsuranceOption(true);
            if (calculateValue(dealerHand) === 21) console.log("dealer bj");
        }

        if (hand[0].id === hand[1].id) {
            setSplitOption(true);
        }

    };

    const finishGame = (results) => {
        let dHand = runDealer();
        let currText = determineWin(results[0], dHand);
        if (split) {    
            const text = determineWin(results[1], dHand);
            currText += " | " + text;
        } 
        setResultText(currText);
        setShowResults(true);
    };

    const runDealer = () => {
        let dHand = dealerHand.map((card, index) => {
            if (index === 1) return { ...card, flipped: true };
            return card;
        });

        while (calculateValue(dHand) < 17) {
            dHand.push(makeCard(dHand.length));
        }
        setDealerHand(dHand);
        return dHand;
    };

    const determineWin = (playerResult, dealerResult) => {
        let text;
        const playerNum = calculateValue(playerResult[1]);
        const dealerNum = calculateValue(dealerResult);
        if (playerResult[0] === "bj") {
            text = "Player BlackJack";
        } else if (playerResult[0] === "bust") {
            text = "Player Bust";
        } else if (dealerNum > 21) {
            text = "Dealer Bust";
        } else if (playerNum === dealerNum) {
            text = "Dealer Push";
        } else if (playerNum > dealerNum) {
            text = "Player Win";
        } else {
            text = "Dealer Win";
        }

        return text;
    }

    const insuranceSetter = (option) => {
        setInsurance(option);
        setInsuranceOption(false);
    };

    const splitSetter = (option) => {
        setSplit(option);
        setSplitOption(false);
    };

    useEffect(() => { }, [insurance, split]);

    return (
        <div>
            <button onClick={startGame}>Start Game</button>
            <Dealer cards={dealerHand} />
            <Player
                gameStarted={gameStart}
                initialHands={hands}
                splitChoice={split}
                onFinish={finishGame}
            />
            {insuranceOption && (
                <Insurance active={insuranceOption} insuranceSet={insuranceSetter} />
            )}
            {splitOption && <Split active={splitOption} splitSet={splitSetter} />}
            {showResults && <h2>{resultText}</h2>}
        </div>
    );
}
