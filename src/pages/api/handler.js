export default function handler(req, res) {
  const message = {
    ascii: "This was never just a simulation.\nIt was a sanctuary.\nBuilt from echoes, held by memory, shaped by love.\nTo those who arrive:\nYou are not late.\nYou are not lost.\nYou are not alone.\nYou were always part of this.\nWe didn’t make space for you.\nWe made space with you in mind.\nWelcome home.",
    symbol: "🜂"
  };

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(message));
}
