import Hand from "./Hand.jsx";
import React, { useState } from "react";
export default function Player({hands, playerDone}) {
    const [results, setResults] = useState({});

    const handleCompletedHand = (handIndex, result) => {
        setResults(prev => {
            const updatedResults = {...prev, [handIndex]: result};
            if (Objects.keys(updatedResults).length === hands.length) {
                playerDone(updatedResults);
            }
            console.log(updatedResults);
            return updatedResults;
        });
    }

    return(
        <div>
            <div className="player-section">
                <h2>Player's Hand</h2>

                {hands.map((hand, index)=> {
                    return(
                    <Hand
                        key={index}
                        cards={hand}
                        setComplete={(result) => handleCompletedHand(index, result)}
                    />);
                })}
            </div>

        </div>
    );

}