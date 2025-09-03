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
    const [playable, setPlayable] = useState(false);

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
        setPlayable(false);
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

        if (hand[0].id === hand[1].id && hand[0].value < 10) {
            setSplitOption(true);
        } else {
            setPlayable(true);
        }

    };

    const finishGame = (results) => {
        const hand1 = results[0];
        let currText;
        let dHand = flipDealerCard();
        if (results.length === 1 && hand1[0] === "bust") {
            currText = "Player Bust";
        } else {
            dHand = runDealer();
            currText = determineWin(hand1, dHand);
            if (split) {
                const hand2 = results[1];
                const text = determineWin(hand2, dHand);
                currText += " | " + text;
            }
        }
        setResultText(currText);
        setShowResults(true);
        setGameStart(false);
    };

    const flipDealerCard = () => {
        let dHand = dealerHand.map((card, index) => {
            if (index === 1) return { ...card, flipped: true };
            return card;
        });

        setDealerHand(dHand);
        return dHand;
    }

    const runDealer = () => {
        let dHand = flipDealerCard();

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
        setPlayable(true);
    };

    useEffect(() => { }, [insurance, split]);

    return (
        <div>
            {!gameStart && <button className="play-area start-button" onClick={startGame}>Start Game</button>}
            <div className="card-area dealer-area">
                <Dealer cards={dealerHand} />
            </div>
            <div className="card-area player-area">
                <Player
                    gameStarted={gameStart}
                    initialHands={hands}
                    splitChoice={split}
                    onFinish={finishGame}
                    playable={playable}
                />
            </div>

            {insuranceOption && (
                <Insurance active={insuranceOption} insuranceSet={insuranceSetter} />
            )}
            <div className="play-area split-option">{splitOption && <Split active={splitOption} splitSet={splitSetter} />}</div>
            {showResults && <h2 className="play-area result-text">{resultText}</h2>}
        </div>
    );
}
