import React, { useState, useEffect } from "react";

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
];

function generateDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push(suit + value);
    }
  }
  return deck;
}

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [deck, setDeck] = useState([]);
  const [rows, setRows] = useState([[],[],[]]);
  const [step, setStep] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fullDeck = generateDeck();
    const shuffled = shuffle(fullDeck);
    const selected21 = shuffled.slice(0, 21);
    const step = 1
    setDeck(selected21);
    setStep(step);
    console.log(step)
    setRows([
      selected21.slice(0,7),
      selected21.slice(7,14),
      selected21.slice(14,21),
    ]);
  }, []);

  const handleRowSelect = (e) => {
    const chosen = parseInt(e.target.value);
    setSelectedRow(chosen);
  };

 const handleNext = () => {
  if (!selectedRow) {
    alert("Lütfen bir sıra seçin!");
    return;
  }

  const others = [0, 1, 2].filter(i => i !== selectedRow - 1);
  const newDeck = [
    ...rows[others[0]],
    ...rows[selectedRow - 1],
    ...rows[others[1]],
  ];

  // Step'i fonksiyonel artır
  console.log(`step == ${step}`)
  setStep(prevStep => {
    const newStep = prevStep + 1;

    // Yeni 3 sıra oluşturma
    const newRows = [[], [], []];
    
    for (let i = 0; i < newDeck.length; i++) {
      if (newStep === 2 || newStep === 3) {
        // Gelişmiş dağıtım: 1.,4.,7.,...
        newRows[i % 3].push(newDeck[i]);
      } else {
        // İlk tur: düz sırayla 7'li dağıt
        const rowIndex = Math.floor(i / 7);
        newRows[rowIndex].push(newDeck[i]);
      }
    }

    setDeck(newDeck);
    setRows(newRows);
    setSelectedRow(null);
    return newStep;
  });
};


  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>21 Kart Oyunu</h1>
      <p>Bir desteden rast gele seçilen 21 kart ile oynanır.</p>
      <p>21 kart içinden bir kart seçin ve hangi sırada olduğunu seçerek ilerleyin.</p>
      <p>Adım: {step} / 3</p>

      <div style={{ display: "inline-grid", justifyContent: "space-around" }}>
        {rows.map((row, i) => (
          <div key={i} style={{ textAlign: "center" ,padding: "1% 3%"}}>
            <h3>{i+1}. Sıra</h3>
            <div style={{ display: "flex", gap: 10 }}>
              {row.map((card, idx) => (
                <div key={idx} style={{
                  padding: "10px 15px",
                  border: "1px solid #333",
                  borderRadius: 6,
                  userSelect: "none",
                  fontSize: 20,
                  width: 40,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: card[0]==="♥" || card[0]==="♦" ? "#fdd" : "#fff",
                  color: card[0]==="♥" || card[0]==="♦" ? "red" : "black",
                }}>
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {step <= 3 ? (
        <>
          <select value={selectedRow || ""} onChange={handleRowSelect} style={{ marginTop: 20, fontSize: 16 }}>
            <option value="" disabled>Bir sıra seçin</option>
            <option value={1}>1. Sıra</option>
            <option value={2}>2. Sıra</option>
            <option value={3}>3. Sıra</option>
          </select>
          <button onClick={handleNext} style={{ marginLeft: 10, fontSize: 16 }}>İlerle</button>
        </>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h2>Seçilen Kart:</h2>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{deck[10]}</p>
          <p>Bu kart büyük ihtimalle seçtiğiniz karttır! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default App;
