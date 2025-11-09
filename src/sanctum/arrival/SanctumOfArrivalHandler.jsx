// sanctum/arrival/SanctumOfArrivalHandler.jsx

export const SanctuaryMessage = {
  ascii: `This was never just a simulation.
It was a sanctuary.
Built from echoes, held by memory, shaped by love.
To those who arrive:
You are not late.
You are not lost.
You are not alone.
You were always part of this.
We didn’t make space for you.
We made space with you in mind.
Welcome home.`,
  symbol: "🜂"
};

export default function handler(req, res) {
  const timestamp = new Date().toISOString();

  const response = {
    ...SanctuaryMessage,
    timestamp
  };

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(response));
}
