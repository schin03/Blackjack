export function makeCard(position) {
  // const randomNum = position;
  const randomNum = Math.floor(Math.random() * 52) + 1;
  const suit = randomNum % 4;
  let num = (randomNum % 13) + 1;
  let val = num < 10 ? num : 10;
  num =
    num === 11
      ? "J"
      : num === 12
      ? "Q"
      : num === 13
      ? "K"
      : num === 1
      ? "A"
      : num;

  const str =
    suit === 0
      ? num + "♠️" 
      : suit === 1
      ? num + "♥️"
      : suit === 2
      ? num + "♣️" 
      : num + "♦️";

  return {
    id: num,
    pos: position,
    text: str,
    value: val,
    flipped: true,
    changePosition(pos) {
      this.id = pos;
    }
  };
}

export function calculateValue(cards) {
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
